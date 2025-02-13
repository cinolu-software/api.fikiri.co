import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs-extra';
import { JwtService } from '@nestjs/jwt';
import { addReviewerDto } from './dto/add-reviewer.dto';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private callRepository: Repository<Call>,
    private jwtService: JwtService
  ) {}

  async create(author: User, dto: CreateCallDto): Promise<Call> {
    try {
      return await this.callRepository.save({ ...dto, author });
    } catch {
      throw new BadRequestException();
    }
  }

  async addReviewer(id: string, dto: addReviewerDto): Promise<Call> {
    try {
      const call = await this.findOne(id);
      const { email, organization } = dto;
      const payload = { email, organization };
      const token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '7d' });
      const reviewers: { [key: string]: string }[] = JSON.parse(call.reviewers);
      reviewers.push({ [email]: token });
      call.reviewers = JSON.stringify(reviewers);
      await this.callRepository.save(call);
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteReviewer(id: string, email: string): Promise<Call> {
    try {
      const call = await this.findOne(id);
      const reviewers: { [key: string]: string }[] = JSON.parse(call.reviewers);
      const newReviewers = reviewers.filter((r) => r[email] === email);
      call.reviewers = JSON.stringify(newReviewers);
      await this.callRepository.save(call);
      return await this.callRepository.save(call);
    } catch {
      throw new BadRequestException();
    }
  }

  async resendReviewLink(email: string): Promise<string> {
    try {
      return await this.jwtService.signAsync({ email }, { secret: process.env.JWT_SECRET, expiresIn: '7d' });
    } catch {
      throw new BadRequestException();
    }
  }

  async publish(publisher: User, id: string): Promise<Call> {
    try {
      const call = await this.findOne(id);
      return await this.callRepository.save({
        ...call,
        publisher,
        published_at: call.created_at ? null : new Date()
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findPublished(): Promise<Call[]> {
    return await this.callRepository.find({
      where: { published_at: Not(IsNull()) }
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
      return await this.callRepository.save({ ...call, document: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Call> {
    try {
      return await this.callRepository.findOneByOrFail({ id });
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
