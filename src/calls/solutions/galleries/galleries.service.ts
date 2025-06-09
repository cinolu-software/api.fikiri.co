import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolutionGallery } from './entities/gallery.entity';
import * as fs from 'fs-extra';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(SolutionGallery)
    private readonly galleryRepository: Repository<SolutionGallery>
  ) {}

  addImage(id: string, files: Express.Multer.File[]): Promise<SolutionGallery[]> {
    try {
      return Promise.all(
        files.map(
          async (file) =>
            await this.galleryRepository.save({
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
      const img = await this.galleryRepository.findOneOrFail({ where: { id } });
      await fs.unlink(`./uploads/solutions/${img.image}`);
      await this.galleryRepository.delete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
