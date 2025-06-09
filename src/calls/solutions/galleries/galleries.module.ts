import { Module } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolutionGallery } from './entities/gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolutionGallery])],
  controllers: [GalleriesController],
  providers: [GalleriesService]
})
export class SolutionsGalleriesModule {}
