import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organisation } from './entities/organisation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationRepository: Repository<Organisation>
  ) {}

  async create(dto: CreateOrganisationDto): Promise<Organisation> {
    try {
      return await this.organisationRepository.save(dto);
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Organisation[]> {
    return await this.organisationRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Organisation> {
    try {
      return await this.organisationRepository.findOneByOrFail({ id });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateOrganisationDto): Promise<Organisation> {
    try {
      const organisation = await this.findOne(id);
      return await this.organisationRepository.save({
        ...organisation,
        ...dto
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.organisationRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
