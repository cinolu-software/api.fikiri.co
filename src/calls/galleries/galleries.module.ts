import { Module } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GaleriesController } from './galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallGallery } from './entities/gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CallGallery])],
  controllers: [GaleriesController],
  providers: [GalleriesService]
})
export class CallsGalleriesModule {}
