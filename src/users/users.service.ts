import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateWithGoogleDto } from '../auth/dto';
import UpdateProfileDto from '../auth/dto/update-profile.dto';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './roles/entities/role.entity';
import { User } from './entities/user.entity';
import { RolesService } from './roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
    private eventEmitter: EventEmitter2
  ) {}

  async findWithRole(name: string): Promise<User[]> {
    const data = await this.userRepository.find({
      relations: ['roles'],
      where: { roles: { name } }
    });
    return data;
  }

  async findAll(): Promise<User[]> {
    const data = await this.userRepository.find({
      relations: ['roles']
    });
    return data;
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const password = Math.floor(100000 + Math.random() * 900000).toString();
      const user = await this.userRepository.save({
        ...dto,
        password,
        organisation: { id: dto?.organisation },
        roles: dto.roles?.map((id) => ({ id }))
      });
      this.eventEmitter.emit('user.created', { user, password });
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async findByRole(id: string): Promise<User[]> {
    try {
      const data = await this.userRepository.find({
        where: { roles: { id } }
      });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const data = await this.userRepository.findBy({
      id: In(ids)
    });
    return data;
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
    if (!currentUser.profile) {
      currentUser.google_image = dto.google_image;
      await this.userRepository.save(currentUser);
    }
    const user = await this.findByEmail(currentUser.email);
    return user;
  }

  async createNewUser(dto: CreateWithGoogleDto, userRole: Role): Promise<User> {
    const newUser = await this.userRepository.save({
      ...dto,
      roles: [userRole]
    });
    const user = await this.findByEmail(newUser.email);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      const oldUser = await this.findOne(id);
      delete oldUser.password;
      const user = await this.userRepository.save({
        ...oldUser,
        ...dto,
        organisation: { id: dto?.organisation || oldUser.organization?.id },
        roles: dto.roles?.map((id) => ({ id })) || oldUser.roles
      });
      return user;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateProfile(currentUser: User, dto: UpdateProfileDto): Promise<User> {
    try {
      const oldUser = await this.findOne(currentUser.id);
      delete oldUser.password;
      await this.userRepository.save({ ...oldUser, ...dto });
      const user = await this.findByEmail(oldUser.email);
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async uploadImage(currenUser: User, file: Express.Multer.File): Promise<User> {
    try {
      const oldUser = await this.findOne(currenUser.id);
      if (oldUser.profile) await fs.unlink(`./uploads/profiles/${oldUser.profile}`);
      delete oldUser.password;
      await this.userRepository.save({ ...oldUser, profile: file.filename });
      const user = await this.findByEmail(oldUser.email);
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async updatePassword(id: string, password: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      await this.userRepository.update(user.id, { password });
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.userRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
