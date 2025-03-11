import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from '../../../shared/decorators/user.decorator';
import { User } from '../../../users/entities/user.entity';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@CurrentUser() reviewer: User, @Body() dto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(reviewer, dto);
  }

  @Get('applications/:id')
  findForApplication(@Param('id') id: string): Promise<Review[]> {
    return this.reviewsService.findForApplication(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto): Promise<Review> {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reviewsService.remove(id);
  }
}
