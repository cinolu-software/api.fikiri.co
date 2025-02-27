import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs-extra';
import { JwtService } from '@nestjs/jwt';
import { addReviewerDto } from './dto/add-reviewer.dto';
import { QueryParams } from './utils/types/query-params.type';

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
      const opportuniy = await this.findOne(id);
      return opportuniy.reviewers as unknown as addReviewerDto[];
    } catch {
      throw new BadRequestException();
    }
  }

  async addReviewer(id: string, dto: addReviewerDto): Promise<{ opportuniy: Opportunity; token: string }> {
    try {
      const opportuniy = await this.findOne(id);
      const token = await this.jwtService.signAsync(
        { ...dto, id },
        { secret: process.env.JWT_SECRET, expiresIn: '7d' }
      );
      const reviewers: addReviewerDto[] = (opportuniy.reviewers as unknown as addReviewerDto[]) ?? [];
      reviewers.push(dto);
      opportuniy.reviewers = reviewers as unknown as JSON;
      const upatedopportuniy = await this.opportunityRepository.save(opportuniy);
      return { opportuniy: upatedopportuniy, token };
    } catch {
      throw new BadRequestException();
    }
  }

  async verifyReviewer(token: string): Promise<addReviewerDto> {
    try {
      const { id, email } = await this.jwtService.verifyAsync(token);
      const opportuniy = await this.findOne(id);
      const reviewers: addReviewerDto[] = opportuniy.reviewers as unknown as addReviewerDto[];
      return reviewers.find((r) => r.email === email);
    } catch {
      throw new NotFoundException();
    }
  }

  async deleteReviewer(id: string, email: string): Promise<Opportunity> {
    try {
      const opportuniy = await this.findOne(id);
      const reviewers: addReviewerDto[] = opportuniy.reviewers as unknown as addReviewerDto[];
      const updatedReviewers = reviewers.filter((r) => r.email === email);
      opportuniy.reviewers = updatedReviewers as unknown as JSON;
      return await this.opportunityRepository.save(opportuniy);
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
      const opportuniy = await this.findOne(id);
      return await this.opportunityRepository.save({
        ...opportuniy,
        publisher,
        published_at: date ? new Date(date) : new Date()
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findLatest(): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({
      where: { published_at: LessThanOrEqual(new Date()) },
      relations: ['author'],
      order: { published_at: 'DESC' },
      take: 5
    });
  }

  async findPublished(queryParams: QueryParams): Promise<[Opportunity[], number]> {
    const { page = 1 } = queryParams;
    const take = 9;
    const skip = (page - 1) * take;
    return await this.opportunityRepository.findAndCount({
      where: { published_at: LessThanOrEqual(new Date()) },
      relations: ['author'],
      take,
      skip
    });
  }

  async findAll(): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async addDocument(id: string, file: Express.Multer.File): Promise<Opportunity> {
    try {
      const opportuniy = await this.findOne(id);
      if (opportuniy.document) await fs.unlink(`./uploads/opportunities/documents/${opportuniy.document}`);
      return await this.opportunityRepository.save({ ...opportuniy, document: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async addCover(id: string, file: Express.Multer.File): Promise<Opportunity> {
    try {
      const opportuniy = await this.findOne(id);
      if (opportuniy.cover) await fs.unlink(`./uploads/opportunities/covers/${opportuniy.cover}`);
      return await this.opportunityRepository.save({ ...opportuniy, document: file.filename });
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
      const opportuniy = await this.findOne(id);
      return await this.opportunityRepository.save({
        ...opportuniy,
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
