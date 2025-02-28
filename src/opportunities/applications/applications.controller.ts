import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CurrentUser } from '../../shared/decorators/user.decorator';
import { User } from '../../users/entities/user.entity';
import { Application } from './entities/application.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Auth } from '../../shared/decorators/auth.decorators';
import { RoleEnum } from '../../shared/enums/roles.enum';
import { v4 as uuidv4 } from 'uuid';

@Controller('applications')
@Auth(RoleEnum.User)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@CurrentUser() applicant: User, @Body() dto: CreateApplicationDto): Promise<Application> {
    return this.applicationsService.create(applicant, dto);
  }

  @Get('for/:id')
  @Auth(RoleEnum.Cartograph)
  findFor(@Param('id') id: string) {
    return this.applicationsService.finFor(id);
  }

  @Post('document/:id')
  @UseInterceptors(
    FileInterceptor('thumb', {
      storage: diskStorage({
        destination: './uploads/calls/applications/documents',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  addDocument(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Application> {
    return this.applicationsService.addDocument(id, file);
  }

  @Get()
  @Auth(RoleEnum.Cartograph)
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.applicationsService.remove(id);
  }
}
