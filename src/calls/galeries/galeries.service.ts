import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CallGalery } from './entities/galery.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs-extra';

@Injectable()
export class GaleriesService {
  constructor(
    @InjectRepository(CallGalery)
    private readonly galeryRepository: Repository<CallGalery>
  ) {}

  addImage(id: string, files: Express.Multer.File[]): Promise<CallGalery[]> {
    try {
      return Promise.all(
        files.map(
          async (file) =>
            await this.galeryRepository.save({
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
      const img = await this.galeryRepository.findOneOrFail({ where: { id } });
      await fs.unlink(`./uploads/calls/${img.image}`);
      await this.galeryRepository.delete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
