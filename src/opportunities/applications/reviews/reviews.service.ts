import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>
  ) {}

  async create(reviwer: User, dto: CreateReviewDto): Promise<Review> {
    try {
      return await this.reviewRepository.save({
        ...dto,
        reviwer,
        application: { id: dto.application }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findForApplication(id: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { application: { id } },
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Review> {
    try {
      return await this.reviewRepository.findOneByOrFail({ id });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.findOne(id);
      return await this.reviewRepository.save({
        ...review,
        application: { id: dto.application }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.reviewRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
