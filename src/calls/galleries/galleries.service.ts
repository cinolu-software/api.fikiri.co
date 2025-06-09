import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CallGallery } from './entities/gallery.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs-extra';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(CallGallery)
    private galleryRepository: Repository<CallGallery>
  ) {}

  addImage(id: string, files: Express.Multer.File[]): Promise<CallGallery[]> {
    try {
      return Promise.all(
        files.map(
          async (file) =>
            await this.galleryRepository.save({
              image: file.filename,
              call: { id }
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
      await fs.unlink(`./uploads/calls/${img.image}`);
      await this.galleryRepository.delete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
