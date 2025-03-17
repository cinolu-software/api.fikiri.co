import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs-extra';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>
  ) {}

  async create(dto: CreatePartnerDto): Promise<Partner> {
    try {
      return await this.partnerRepository.save({ ...dto });
    } catch {
      throw new BadRequestException();
    }
  }

  async createForOpportunity(dto: CreatePartnerDto, opportunityId: string): Promise<Partner> {
    try {
      return await this.partnerRepository.save({ ...dto, opportunity: { id: opportunityId } });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Partner[]> {
    return await this.partnerRepository.find();
  }

  async addLogo(id: string, file: Express.Multer.File) {
    try {
      const partner = await this.findOne(id);
      if (partner.logo) await fs.unlink(`./uploads/partners/${partner.logo}`);
      return await this.partnerRepository.save({ ...partner, logo: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Partner> {
    try {
      return await this.partnerRepository.findOneOrFail({
        where: { id }
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdatePartnerDto): Promise<Partner> {
    try {
      await this.partnerRepository.update(id, { ...dto });
      return await this.findOne(id);
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.partnerRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
