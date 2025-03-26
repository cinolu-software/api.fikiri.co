import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solution } from './entities/solution.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IReviewer } from '../utils/types/reviewer.type';

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

  async findAll(): Promise<Solution[]> {
    return await this.solutionRepository.find({
      order: { updated_at: 'DESC' },
      relations: ['user']
    });
  }

  async findUnaffected(id: string, count: number): Promise<[Solution[], number]> {
    return await this.solutionRepository.findAndCount({
      where: { reviewer: IsNull(), call: { id } },
      take: count
    });
  }

  async findAffectedForReviewer(callId: string, reviewer: string): Promise<Solution[]> {
    return await this.solutionRepository.find({
      where: {
        reviewer,
        call: { id: callId }
      }
    });
  }

  async findByReviewer(token: string): Promise<Solution[]> {
    try {
      const { id, email } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      return await this.findAffectedForReviewer(id, email);
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
      const solutions = await this.findAffectedForReviewer(callId, reviewer);
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
      return await this.solutionRepository.findOneByOrFail({ id });
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
