import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolutionGalery } from './entities/galery.entity';
import * as fs from 'fs-extra';

@Injectable()
export class GaleriesService {
  constructor(
    @InjectRepository(SolutionGalery)
    private readonly galeryRepository: Repository<SolutionGalery>
  ) {}

  addImage(id: string, files: Express.Multer.File[]): Promise<SolutionGalery[]> {
    try {
      return Promise.all(
        files.map(
          async (file) =>
            await this.galeryRepository.save({
              image: file.filename,
              solution: { id }
            })
        )
      );
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      const img = await this.galeryRepository.findOneOrFail({ where: { id } });
      await fs.unlink(`./uploads/solutions/${img.image}`);
      await this.galeryRepository.delete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
