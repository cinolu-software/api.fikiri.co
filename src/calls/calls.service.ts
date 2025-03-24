import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs-extra';
import { JwtService } from '@nestjs/jwt';
import { addReviewerDto } from './dto/add-reviewer.dto';
import { QueryParams } from './utils/types/query-params.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApplicationsService } from './applications/applications.service';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private callRepository: Repository<Call>,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private applicationsService: ApplicationsService
  ) {}

  async create(author: User, dto: CreateCallDto): Promise<Call> {
    try {
      return await this.callRepository.save({ ...dto, author });
    } catch {
      throw new BadRequestException();
    }
  }

  async verifyReviewer(token: string): Promise<addReviewerDto> {
    try {
      const { id, email } = await this.jwtService.verifyAsync(token);
      const call = await this.findOne(id);
      const reviewers: addReviewerDto[] = call.reviewers as unknown as addReviewerDto[];
      return reviewers.find((r) => r.email === email);
    } catch {
      throw new NotFoundException();
    }
  }

  async findReviewers(id: string): Promise<addReviewerDto[]> {
    try {
      const call = await this.findOne(id);
      return call.reviewers as unknown as addReviewerDto[];
    } catch {
      throw new BadRequestException();
    }
  }

  async sendReviewLink(id: string, dto: addReviewerDto): Promise<void> {
    try {
      const token = await this.jwtService.signAsync(
        { ...dto, id },
        { secret: process.env.JWT_SECRET, expiresIn: '7d' }
      );
      const link = `${process.env.ACCOUNT_URI}review/${token}`;
      this.eventEmitter.emit('add-reviewer', { user: dto, link });
    } catch {
      throw new BadRequestException();
    }
  }

  async addReviewer(id: string, dto: addReviewerDto): Promise<Call> {
    try {
      const call = await this.findOne(id);
      await this.sendReviewLink(id, dto);
      const reviewers = (call.reviewers || []) as addReviewerDto[];
      reviewers.push(dto);
      call.reviewers = reviewers as unknown as JSON;
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async updateReviewer(id: string, dto: addReviewerDto): Promise<Call> {
    try {
      const call = await this.findOne(id);
      const reviewers = (call.reviewers || []) as addReviewerDto[];
      const index = reviewers.findIndex((reviewer) => reviewer.email === dto.email);
      if (index === -1) throw new NotFoundException();
      reviewers[index] = dto;
      call.reviewers = reviewers as unknown as JSON;
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteReviewer(id: string, email: string): Promise<Call> {
    try {
      const call = await this.findOne(id);
      const reviewers = (call.reviewers || []) as addReviewerDto[];
      const updatedReviewers = reviewers.filter((r) => r.email !== email);
      call.reviewers = updatedReviewers as unknown as JSON;
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async resendReviewLink(id: string, dto: addReviewerDto): Promise<void> {
    try {
      await this.sendReviewLink(id, dto);
    } catch {
      throw new BadRequestException();
    }
  }

  async unpublish(id: string): Promise<Call> {
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

  async publish(publisher: User, id: string, date: Date): Promise<Call> {
    try {
      const call = await this.findOne(id);
      return await this.callRepository.save({
        ...call,
        publisher,
        published_at: date ? new Date(date) : new Date()
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findLatest(): Promise<Call[]> {
    return await this.callRepository.find({
      where: { published_at: LessThanOrEqual(new Date()) },
      relations: ['author'],
      order: { published_at: 'DESC' },
      take: 5
    });
  }

  async findUnpublished(queryParams: QueryParams): Promise<[Call[], number]> {
    const { page = 1 } = queryParams;
    const take = 9;
    const today = new Date();
    const skip = (page - 1) * take;
    return await this.callRepository.findAndCount({
      where: { published_at: MoreThan(today) },
      order: { published_at: 'ASC' },
      relations: ['author'],
      take,
      skip
    });
  }

  async findPublished(queryParams: QueryParams): Promise<[Call[], number]> {
    const { page = 1 } = queryParams;
    const take = 9;
    const skip = (page - 1) * take;
    const today = new Date();
    return await this.callRepository.findAndCount({
      where: { published_at: LessThanOrEqual(today) },
      order: { published_at: 'ASC' },
      relations: ['author'],
      take,
      skip
    });
  }

  async findAll(): Promise<Call[]> {
    return await this.callRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async addDocument(id: string, file: Express.Multer.File): Promise<Call> {
    try {
      const call = await this.findOne(id);
      if (call.document) await fs.unlink(`./uploads/calls/documents/${call.document}`);
      return await this.callRepository.save({ ...call, document: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async addCover(id: string, file: Express.Multer.File): Promise<Call> {
    try {
      const call = await this.findOne(id);
      if (call.cover) await fs.unlink(`./uploads/calls/covers/${call.cover}`);
      return await this.callRepository.save({ ...call, cover: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Call> {
    try {
      return await this.callRepository.findOneOrFail({
        where: { id },
        relations: ['author']
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateCallDto): Promise<Call> {
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

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.callRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
