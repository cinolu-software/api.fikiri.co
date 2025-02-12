import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDetailDto } from './dto/create-detail.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Detail } from './entities/detail.entity';

@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>
  ) {}

  async create(dto: CreateDetailDto): Promise<Detail> {
    try {
      return await this.detailRepository.save(dto);
    } catch {
      throw new BadRequestException();
    }
  }
}
