import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from './entities/organisation.entity';

@Controller('organisations')
export class OrganisationsController {
  constructor(private organisationsService: OrganisationsService) {}

  @Post()
  create(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Get()
  findAll(): Promise<Organisation[]> {
    return this.organisationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organisation> {
    return this.organisationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganisationDto): Promise<Organisation> {
    return this.organisationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.organisationsService.remove(id);
  }
}
