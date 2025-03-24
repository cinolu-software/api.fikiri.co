import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { CallsModule } from '../../calls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), forwardRef(() => CallsModule)],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
