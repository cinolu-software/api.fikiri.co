import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    try {
      return await this.organizationRepository.save(dto);
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Organization> {
    try {
      return await this.organizationRepository.findOneByOrFail({ id });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    try {
      const organization = await this.findOne(id);
      return await this.organizationRepository.save({
        ...organization,
        ...dto
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.organizationRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
