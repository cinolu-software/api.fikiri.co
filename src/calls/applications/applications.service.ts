import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as fs from 'fs-extra';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>
  ) {}

  async create(applicant: User, dto: CreateApplicationDto): Promise<Application> {
    try {
      return await this.applicationRepository.save({
        ...dto,
        call: { id: dto.call },
        applicant
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationRepository.find({
      order: { created_at: 'DESC' },
      relations: ['applicant']
    });
  }

  async findOne(id: string): Promise<Application> {
    try {
      return await this.applicationRepository.findOneByOrFail({ id });
    } catch {
      throw new NotFoundException();
    }
  }

  async addDocument(id: string, file: Express.Multer.File): Promise<Application> {
    try {
      const application = await this.findOne(id);
      if (application.document) await fs.unlink(`./uploads/calls/applications/documents/${application.document}`);
      return await this.applicationRepository.save({ ...application, document: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: UpdateApplicationDto): Promise<Application> {
    try {
      const application = await this.findOne(id);
      return await this.applicationRepository.save({
        ...application,
        ...dto,
        call: { id: dto.call }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.applicationRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
