import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { callSolution } from './entities/call.entity';
import { IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs-extra';
import { JwtService } from '@nestjs/jwt';
import { QueryParams } from './utils/types/query-params.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SolutionsService } from './solutions/solutions.service';
import { IReviewer } from './utils/types/reviewer.type';
import { IForm } from './utils/types/form.type';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(callSolution)
    private callRepository: Repository<callSolution>,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private solutionsService: SolutionsService
  ) {}

  async create(author: User, dto: CreateCallDto): Promise<callSolution> {
    try {
      return await this.callRepository.save({ ...dto, author });
    } catch {
      throw new BadRequestException();
    }
  }

  async awards(id: string, solutionsIds: string[]): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      return await this.callRepository.save({
        ...call,
        awards: solutionsIds?.map((id) => ({ id }))
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async publish(publisher: User, id: string): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      return await this.callRepository.save({
        ...call,
        publisher,
        published_at: new Date()
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async unpublish(id: string): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      return await this.callRepository.save({
        ...call,
        published_at: null,
        publisher: null
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findLatest(): Promise<callSolution[]> {
    return await this.callRepository.find({
      where: { published_at: LessThanOrEqual(new Date()) },
      relations: ['author'],
      order: { published_at: 'DESC' },
      take: 5
    });
  }

  async findUnpublished(queryParams: QueryParams): Promise<[callSolution[], number]> {
    const { page = 1 } = queryParams;
    const take = 9;
    const skip = (page - 1) * take;
    return await this.callRepository.findAndCount({
      where: { published_at: IsNull() },
      order: { published_at: 'DESC' },
      relations: ['author'],
      take,
      skip
    });
  }

  async findReviewForm(token: string): Promise<IForm> {
    try {
      const { id, phase } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      const call = await this.callRepository.findOneOrFail({
        where: { id }
      });
      const forms = (call.review_form || []) as unknown as IForm[];
      const form = forms.find((f) => f.phase === phase);
      if (!form) throw new NotFoundException();
      return form;
    } catch {
      throw new NotFoundException();
    }
  }

  async findPublished(queryParams: QueryParams): Promise<[callSolution[], number]> {
    const { page = 1 } = queryParams;
    const take = 5;
    const skip = (page - 1) * take;
    return await this.callRepository.findAndCount({
      where: { published_at: Not(IsNull()) },
      order: { published_at: 'ASC' },
      relations: ['gallery'],
      take,
      skip
    });
  }

  async findAll(): Promise<callSolution[]> {
    return await this.callRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async addDocument(id: string, file: Express.Multer.File): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      if (call.document) await fs.unlink(`./uploads/calls/documents/${call.document}`);
      return await this.callRepository.save({
        ...call,
        document: file.filename
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async addCover(id: string, file: Express.Multer.File): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      if (call.cover) await fs.unlink(`./uploads/calls/covers/${call.cover}`);
      return await this.callRepository.save({ ...call, cover: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<callSolution> {
    try {
      return await this.callRepository.findOneOrFail({
        where: { id },
        relations: ['author', 'awards', 'gallery']
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateCallDto): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      return await this.callRepository.save({
        ...call,
        ...dto
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findReviewers(id: string): Promise<IReviewer[]> {
    try {
      const call = await this.findOne(id);
      return (call.reviewers || []) as unknown as IReviewer[];
    } catch {
      throw new BadRequestException();
    }
  }

  async generateReviewLink(id: string, dto: IReviewer): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { ...dto, id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '7d'
        }
      );
    } catch {
      throw new BadRequestException();
    }
  }

  async sendReviewLink(dto: IReviewer, token: string): Promise<void> {
    try {
      const link = `${process.env.ACCOUNT_URI}review?token=${token}`;
      this.eventEmitter.emit('add-reviewer', { user: dto, link });
    } catch {
      throw new BadRequestException();
    }
  }

  async addReviewer(id: string, reviewer: IReviewer): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      const reviewers = (call.reviewers || []) as unknown as IReviewer[];
      call.reviewers = [...reviewers, reviewer] as unknown as JSON;
      await this.solutionsService.affect(id, reviewer);
      const token = await this.generateReviewLink(id, reviewer);
      await this.sendReviewLink(reviewer, token);
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async updateReviewer(id: string, email: string, dto: IReviewer): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      const reviewers = (call.reviewers || []) as unknown as IReviewer[];
      if (!reviewers) throw new BadRequestException();
      const reviewer = reviewers.find((r) => r.email === email);
      call.reviewers = reviewers.map((r) => (r.email === reviewer.email ? dto : r)) as unknown as JSON;
      await this.solutionsService.reaffect(id, reviewer, dto);
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteReviewer(id: string, email: string): Promise<callSolution> {
    try {
      const call = await this.findOne(id);
      const reviewers = (call.reviewers || []) as unknown as IReviewer[];
      call.reviewers = reviewers?.filter((r) => r.email !== email) as unknown as JSON;
      await this.solutionsService.desaffect(id, email);
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async resendReviewLink(id: string, dto: IReviewer): Promise<void> {
    try {
      const token = await this.generateReviewLink(id, dto);
      await this.sendReviewLink(dto, token);
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.callRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
