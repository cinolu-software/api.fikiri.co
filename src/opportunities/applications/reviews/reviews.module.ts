import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), forwardRef(() => AuthModule)],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
