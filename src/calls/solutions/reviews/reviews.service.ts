import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private jwtService: JwtService
  ) {}

  async create(token: string, dto: CreateReviewDto): Promise<Review> {
    try {
      const { email } = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      return await this.reviewRepository.save({
        ...dto,
        reviewer: email,
        solution: { id: dto.solution }
      });
    } catch {
      throw new BadRequestException();
    }
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
        solution: { id: dto.solution }
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
