import { Module } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { SolutionsController } from './solutions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solution } from './entities/solution.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { SolutionsGalleriesModule } from './galleries/galleries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Solution]), ReviewsModule, SolutionsGalleriesModule],
  controllers: [SolutionsController],
  providers: [SolutionsService],
  exports: [SolutionsService]
})
export class SolutionsModule {}
