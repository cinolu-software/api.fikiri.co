import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solution } from './entities/solution.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IReviewer } from '../utils/types/reviewer.type';
import * as fs from 'fs-extra';
import { QueryParams } from '../utils/types/query-params.type';
import { ESatus } from '../utils/enums/status.enum';
import slugify from 'slugify';
import { SearchQueryParams } from '../utils/types/search-query-params.type';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(Solution)
    private solutionRepository: Repository<Solution>,
    private jwtService: JwtService
  ) {}

  async create(user: User, dto: CreateSolutionDto): Promise<Solution> {
    try {
      return await this.solutionRepository.save({
        ...dto,
        user,
        call: { id: dto.call }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findByUser(id: string): Promise<Solution[]> {
    try {
      return await this.solutionRepository.find({
        where: { user: { id } },
        relations: ['user', 'call', 'gallery']
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findMapped(queryParams: QueryParams): Promise<[Solution[], number]> {
    try {
      const page = queryParams.page || 1;
      const take = 12;
      return await this.solutionRepository.findAndCount({
        where: { status: ESatus.MAPPED },
        relations: ['user'],
        order: { updated_at: 'DESC' },
        skip: (page - 1) * take,
        take: take
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<Solution> {
    try {
      const solution = await this.solutionRepository.findOneOrFail({
        where: { id }
      });
      if (solution.image) await fs.unlink(`./uploads/solutions/${solution.image}`);
      await this.solutionRepository.save({ ...solution, image: file.filename });
      return await this.findOne(id);
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(page: number): Promise<[Solution[], number]> {
    return await this.solutionRepository
      .createQueryBuilder('solution')
      .leftJoinAndSelect('solution.user', 'user')
      .orderBy('solution.image', 'DESC')
      .addOrderBy('solution.updated_at', 'DESC')
      .skip((page - 1) * 40)
      .take(40)
      .getManyAndCount();
  }

  async searchBy(queryParams: SearchQueryParams): Promise<[Solution[], number]> {
    try {
      const { page, query } = queryParams;
      return await this.solutionRepository
        .createQueryBuilder('solution')
        .where('solution.name LIKE :query OR solution.description LIKE :query', { query: `%${query}%` })
        .take(40)
        .skip(((page || 1) - 1) * 40)
        .getManyAndCount();
    } catch {
      throw new BadRequestException();
    }
  }

  async updateSchema(): Promise<void> {
    try {
      const solutions = await this.solutionRepository.find();
      solutions.map(async (solution) => {
        const responses = solution.responses as unknown as { [key: string]: string };
        solution.problem_solved = responses['Problème ciblé '];
        solution.name = responses['Nom de la solution'];
        solution.description = responses['Nom de la solution'];
        const name = responses['Nom de la solution'];
        if (!name) await this.solutionRepository.remove(solution);
        if (name) solution.slug = slugify(String(name), { lower: true });
        delete responses['Problème ciblé '];
        delete responses['Nom de la solution'];
        delete responses['Nom de la solution'];
        solution.responses = responses as unknown as JSON;
        await this.solutionRepository.save(solution);
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findBySlug(slug: string): Promise<Solution> {
    try {
      return await this.solutionRepository.findOneOrFail({
        where: { slug },
        relations: ['user']
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findAwards(): Promise<Solution[]> {
    return await this.solutionRepository.find({
      where: { award: { id: Not(IsNull()) } },
      relations: ['user']
    });
  }

  async findUnaffected(id: string, count: number): Promise<[Solution[], number]> {
    return await this.solutionRepository.findAndCount({
      where: { reviewer: IsNull(), call: { id } },
      take: count
    });
  }

  async findAffectedToReviewer(callId: string, reviewer: string): Promise<Solution[]> {
    return await this.solutionRepository.find({
      where: {
        reviewer,
        call: { id: callId }
      },
      relations: ['user', 'reviews']
    });
  }

  async findByReviewer(token: string): Promise<Solution[]> {
    try {
      const { id, email } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      return await this.findAffectedToReviewer(id, email);
    } catch {
      throw new NotFoundException();
    }
  }

  async affect(callId: string, reviewer: IReviewer) {
    try {
      const [unaffected, n] = await this.findUnaffected(callId, reviewer.solutions);
      if (n === 0) throw new BadRequestException();
      const affected = unaffected.map((solution) => {
        solution.reviewer = reviewer.email;
        return solution;
      });
      return await this.solutionRepository.save(affected);
    } catch {
      throw new BadRequestException();
    }
  }

  async desaffect(callId: string, reviewer: string): Promise<Solution[]> {
    try {
      const solutions = await this.findAffectedToReviewer(callId, reviewer);
      if (!solutions) throw new BadRequestException();
      const desaffected = solutions.map((solution) => {
        solution.reviewer = null;
        return solution;
      });
      return await this.solutionRepository.save(desaffected);
    } catch {
      throw new BadRequestException();
    }
  }

  async reaffect(callId: string, oldReviewer: IReviewer, reviewer: IReviewer): Promise<Solution[]> {
    try {
      await this.desaffect(callId, oldReviewer.email);
      return await this.affect(callId, reviewer);
    } catch {
      throw new BadRequestException();
    }
  }

  async findByCall(id: string): Promise<Solution[]> {
    try {
      return await this.solutionRepository.findBy({
        call: { id }
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findOne(id: string): Promise<Solution> {
    try {
      return await this.solutionRepository.findOneOrFail({
        where: { id },
        relations: ['user']
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateSolutionDto): Promise<Solution> {
    try {
      const solution = await this.findOne(id);
      return await this.solutionRepository.save({
        ...solution,
        ...dto,
        call: { id: dto.call }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.solutionRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
