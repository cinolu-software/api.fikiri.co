import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { MoreThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs-extra';
import { JwtService } from '@nestjs/jwt';
import { addReviewerDto } from './dto/add-reviewer.dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
    private jwtService: JwtService
  ) {}

  async create(author: User, dto: CreateOpportunityDto): Promise<Opportunity> {
    try {
      return await this.opportunityRepository.save({ ...dto, author });
    } catch {
      throw new BadRequestException();
    }
  }

  async findReviewers(id: string): Promise<addReviewerDto[]> {
    try {
      const call = await this.findOne(id);
      return JSON.parse(call.reviewers) as addReviewerDto[];
    } catch {
      throw new BadRequestException();
    }
  }

  async addReviewer(id: string, dto: addReviewerDto): Promise<{ call: Opportunity; token: string }> {
    try {
      const call = await this.findOne(id);
      const token = await this.jwtService.signAsync(
        { ...dto, id },
        { secret: process.env.JWT_SECRET, expiresIn: '7d' }
      );
      const reviewers: addReviewerDto[] = JSON.parse(call.reviewers) ?? [];
      reviewers.push(dto);
      call.reviewers = JSON.stringify(reviewers);
      const upatedCall = await this.opportunityRepository.save(call);
      return { call: upatedCall, token };
    } catch {
      throw new BadRequestException();
    }
  }

  async verifyReviewer(token: string): Promise<addReviewerDto> {
    try {
      const { id, email } = await this.jwtService.verifyAsync(token);
      const call = await this.findOne(id);
      const reviewers: addReviewerDto[] = JSON.parse(call.reviewers);
      return reviewers.find((r) => r.email === email);
    } catch {
      throw new NotFoundException();
    }
  }

  async deleteReviewer(id: string, email: string): Promise<Opportunity> {
    try {
      const call = await this.findOne(id);
      const reviewers: addReviewerDto[] = JSON.parse(call.reviewers);
      const updatedReviewers = reviewers.filter((r) => r.email === email);
      call.reviewers = JSON.stringify(updatedReviewers);
      return await this.opportunityRepository.save(call);
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

  async publish(publisher: User, id: string, date: Date): Promise<Opportunity> {
    try {
      const call = await this.findOne(id);
      return await this.opportunityRepository.save({
        ...call,
        publisher,
        published_at: new Date(date)
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findLatest(): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({
      where: { published_at: MoreThan(new Date(0)) },
      relations: ['author', 'publisher'],
      order: { published_at: 'DESC' },
      take: 5
    });
  }

  async findPublished(): Promise<Opportunity[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await this.opportunityRepository.find({
      where: { published_at: MoreThan(today) }
    });
  }

  async findAll(): Promise<[Opportunity[], number]> {
    return await this.opportunityRepository.findAndCount({
      order: { created_at: 'DESC' }
    });
  }

  async addDocument(id: string, file: Express.Multer.File): Promise<Opportunity> {
    try {
      const call = await this.findOne(id);
      if (call.document) await fs.unlink(`./uploads/opportunities/documents/${call.document}`);
      return await this.opportunityRepository.save({ ...call, document: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async addCover(id: string, file: Express.Multer.File): Promise<Opportunity> {
    try {
      const call = await this.findOne(id);
      if (call.cover) await fs.unlink(`./uploads/opportunities/covers/${call.cover}`);
      return await this.opportunityRepository.save({ ...call, document: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Opportunity> {
    try {
      return await this.opportunityRepository.findOneOrFail({
        where: { id },
        relations: ['author']
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateOpportunityDto): Promise<Opportunity> {
    try {
      const call = await this.findOne(id);
      return await this.opportunityRepository.save({
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
      await this.opportunityRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
