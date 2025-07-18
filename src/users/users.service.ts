import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateWithGoogleDto, SignUpDto } from '../auth/dto';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './roles/entities/role.entity';
import { User } from './entities/user.entity';
import { RolesService } from './roles/roles.service';
import { generateRandomPassword } from 'src/shared/utils/generate-password.fn';
import { JwtService } from '@nestjs/jwt';
import { format } from 'fast-csv';
import { Response } from 'express';
import { QueryParams } from './utils/types/query-params.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService
  ) {}

  async exportAllToCSV(queryParams: QueryParams, res: Response): Promise<void> {
    try {
      const { q } = queryParams;
      const query = this.userRepository
        .createQueryBuilder('user')
        .select(['user.name', 'user.email', 'user.phone_number'])
        .orderBy('user.updated_at', 'DESC');
      if (q) query.where('user.name LIKE :q OR user.email LIKE :q', { q: `%${q}%` });
      const users = await query.getMany();
      const csvStream = format({ headers: ['Name', 'Email', 'Phone Number'] });
      csvStream.pipe(res);
      users.forEach((user) => {
        csvStream.write({ Name: user.name, Email: user.email, 'Phone Number': user.phone_number });
      });
      csvStream.end();
    } catch {
      throw new BadRequestException();
    }
  }

  async exportOutreachersToCSV(queryParams: QueryParams, res: Response): Promise<void> {
    try {
      const query = this.findOutreachersQuery(queryParams.q);
      const users = await query.getRawMany();
      const csvStream = format({ headers: ['Nom', 'Email', 'Stat'] });
      csvStream.pipe(res);
      users.forEach((user) => {
        csvStream.write({ Nom: user['name'], Email: user['email'], Stat: user['outreachCount'] });
      });
      csvStream.end();
    } catch {
      throw new BadRequestException();
    }
  }

  async findWithRole(name: string): Promise<User[]> {
    const data = await this.userRepository.find({
      relations: ['roles'],
      where: { roles: { name } }
    });
    return data;
  }

  async findAll(queryParams: QueryParams): Promise<[User[], number]> {
    const { page = 1, q } = queryParams;
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .orderBy('user.updated_at', 'DESC');
    if (q) query.where('user.name LIKE :q OR user.email LIKE :q', { q: `%${q}%` });
    return await query
      .skip((+page - 1) * 40)
      .take(40)
      .getManyAndCount();
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const popularization_link = await this.jwtService.signAsync(
        { email: dto.email },
        { expiresIn: '30d', secret: process.env.JWT_SECRET }
      );
      const password = generateRandomPassword();
      const user = await this.userRepository.save({
        ...dto,
        password,
        popularization_link,
        organisation: { id: dto?.organisation },
        roles: dto.roles?.map((id) => ({ id }))
      });
      this.eventEmitter.emit('user.created', { user, password });
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async findUsersWithOutreachCount(queryParams: QueryParams): Promise<[User[], number]> {
    const { page = 1, q } = queryParams;
    const query = this.findOutreachersQuery(q);
    const outreachers = query
      .limit(40)
      .offset((+page - 1) * 40)
      .getRawMany();
    const countResult = query.getCount();
    return await Promise.all([outreachers, countResult]);
  }

  async findOutreachCount(user: User): Promise<number> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .select('user.outreacher')
        .where('user.outreacher = :outreacher', { outreacher: user.email })
        .addSelect('COUNT(user.id)', 'count')
        .groupBy('user.outreacher')
        .getCount();
    } catch {
      throw new BadRequestException();
    }
  }

  async generateOutreachLink(user: User): Promise<User> {
    try {
      const outreach_link = await this.jwtService.signAsync(
        { email: user.email },
        { expiresIn: '1y', secret: process.env.JWT_SECRET }
      );
      await this.userRepository.update(user.id, { outreach_link });
      return await this.findOne(user.id);
    } catch {
      throw new BadRequestException();
    }
  }

  async signUp(dto: SignUpDto, outreach_link: string, outreacher: string): Promise<User> {
    try {
      const userRole = await this.rolesService.findByName('user');
      const password = generateRandomPassword();
      const user = await this.userRepository.save({
        ...dto,
        password,
        outreacher,
        outreach_link,
        roles: [userRole]
      });
      this.eventEmitter.emit('user.created', { user, password });
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['roles', 'organization']
      });
      const roles = user.roles.map((role) => role.name);
      return { ...user, roles } as unknown as User;
    } catch {
      throw new BadRequestException();
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email },
        relations: ['roles']
      });
      const roles = user.roles.map((role) => role.name);
      return { ...user, roles } as unknown as User;
    } catch {
      throw new NotFoundException();
    }
  }

  async findOrCreate(dto: CreateWithGoogleDto): Promise<User> {
    try {
      const role = await this.rolesService.findByName('user');
      const user = await this.userRepository.findOne({
        where: { email: dto.email }
      });
      if (user) return await this.updateExistingUser(user, dto);
      return await this.createNewUser(dto, role);
    } catch {
      throw new BadRequestException();
    }
  }

  async updateExistingUser(currentUser: User, dto: CreateWithGoogleDto): Promise<User> {
    delete currentUser.password;
    if (!currentUser.profile) {
      currentUser.google_image = dto.google_image;
      await this.userRepository.save(currentUser);
    }
    return await this.findByEmail(currentUser.email);
  }

  async createNewUser(dto: CreateWithGoogleDto, userRole: Role): Promise<User> {
    const newUser = await this.userRepository.save({
      ...dto,
      roles: [userRole]
    });
    return await this.findByEmail(newUser.email);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      const oldUser = await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['roles']
      });
      delete oldUser.password;
      const user = await this.userRepository.save({
        ...oldUser,
        ...dto,
        organisation: { id: dto?.organisation || oldUser.organization?.id },
        roles: dto.roles?.map((id) => ({ id })) || oldUser.roles
      });
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async updateProfile(currentUser: User, dto: UpdateUserDto): Promise<User> {
    try {
      const oldUser = await this.userRepository.findOneOrFail({
        where: { id: currentUser.id },
        relations: ['roles']
      });
      delete oldUser.password;
      await this.userRepository.save({
        ...oldUser,
        ...dto,
        roles: dto?.roles?.map((id) => ({ id })) || oldUser.roles
      });
      return await this.findByEmail(oldUser.email);
    } catch {
      throw new BadRequestException();
    }
  }

  async uploadImage(currenUser: User, file: Express.Multer.File): Promise<User> {
    try {
      const oldUser = await this.userRepository.findOneOrFail({
        where: { id: currenUser.id },
        relations: ['roles']
      });
      delete oldUser.password;
      if (oldUser.profile) await fs.unlink(`./uploads/profiles/${oldUser.profile}`);
      await this.userRepository.save({ ...oldUser, profile: file.filename });
      return await this.findByEmail(oldUser.email);
    } catch {
      throw new BadRequestException();
    }
  }

  async updatePassword(id: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id }
      });
      await this.userRepository.update(user.id, { password });
      return await this.findByEmail(user.email);
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.userRepository.findOneOrFail({
        where: { id }
      });
      await this.userRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }

  findOutreachersQuery(q: string | null): SelectQueryBuilder<User> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select(['outreacher AS email', 'COUNT(id) AS outreachCount'])
            .from(User, 'referred')
            .where('outreacher IS NOT NULL')
            .groupBy('outreacher');
        },
        'outreach_stats',
        'outreach_stats.email = user.email'
      )
      .select([
        'user.id AS id',
        'user.profile AS profile',
        'user.google_image AS google_image',
        'user.name AS name',
        'user.email AS email',
        'outreach_stats.outreachCount AS outreachCount'
      ]);
    if (q) query.andWhere('user.name LIKE :q OR user.email LIKE :q', { q: `%${q}%` });
    return query.orderBy('outreach_stats.outreachCount', 'DESC');
  }
}
