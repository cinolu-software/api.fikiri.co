import { Module } from '@nestjs/common';
import { GaleriesService } from './galeries.service';
import { GaleriesController } from './galeries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolutionGalery } from './entities/galery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolutionGalery])],
  controllers: [GaleriesController],
  providers: [GaleriesService]
})
export class SolutionsGaleriesModule {}
