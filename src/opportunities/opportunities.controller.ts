import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query
} from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { Opportunity } from './entities/opportunity.entity';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '../shared/decorators/auth.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { addReviewerDto } from './dto/add-reviewer.dto';
import { QueryParams } from './utils/types/query-params.type';
import { Application } from './applications/entities/application.entity';

@Controller('opportunities')
@Auth(RoleEnum.Cartograph)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  create(@CurrentUser() author: User, @Body() dto: CreateOpportunityDto): Promise<Opportunity> {
    return this.opportunitiesService.create(author, dto);
  }

  @Get('find-unpublished')
  @Auth(RoleEnum.Guest)
  findUnpublished(@Query() queryParams: QueryParams): Promise<[Opportunity[], number]> {
    return this.opportunitiesService.findUnpublished(queryParams);
  }

  @Get('find-published')
  @Auth(RoleEnum.Guest)
  findPublished(@Query() queryParams: QueryParams): Promise<[Opportunity[], number]> {
    return this.opportunitiesService.findPublished(queryParams);
  }

  @Get('find-latest')
  @Auth(RoleEnum.Guest)
  findLatest(): Promise<Opportunity[]> {
    return this.opportunitiesService.findLatest();
  }

  @Get('find-applications/:token')
  @Auth(RoleEnum.Guest)
  findFor(@Param('token') token: string): Promise<Application[]> {
    return this.opportunitiesService.findFor(token);
  }

  @Get('find-reviewers/:id')
  findReviewers(@Param('id') id: string): Promise<addReviewerDto[]> {
    return this.opportunitiesService.findReviewers(id);
  }

  @Post('add-reviewer/:id')
  addReviwer(@Param('id') id: string, @Body() dto: addReviewerDto): Promise<Opportunity> {
    return this.opportunitiesService.addReviewer(id, dto);
  }

  @Delete('delete-reviewer/:id')
  deleteReviewer(@Param('id') id: string, @Body('email') email: string): Promise<Opportunity> {
    return this.opportunitiesService.deleteReviewer(id, email);
  }

  @Post('resend-review-link/:id')
  resendReviewLink(@Param('id') id: string, @Body() dto: addReviewerDto): Promise<void> {
    return this.opportunitiesService.resendReviewLink(id, dto);
  }

  @Post('cover/:id')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/opportunities/covers',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  addCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Opportunity> {
    return this.opportunitiesService.addCover(id, file);
  }

  @Post('document/:id')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('doc', {
      storage: diskStorage({
        destination: './uploads/opportunities/documents',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  addDocument(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Opportunity> {
    return this.opportunitiesService.addDocument(id, file);
  }

  @Post('unpublish/:id')
  unpublish(@Param('id') id: string): Promise<Opportunity> {
    return this.opportunitiesService.unpublish(id);
  }

  @Post('publish/:id')
  publish(@CurrentUser() publisher: User, @Param('id') id: string, @Body('date') date: Date): Promise<Opportunity> {
    return this.opportunitiesService.publish(publisher, id, date);
  }

  @Get()
  findAll(): Promise<Opportunity[]> {
    return this.opportunitiesService.findAll();
  }

  @Get(':id')
  @Auth(RoleEnum.Guest)
  findOne(@Param('id') id: string): Promise<Opportunity> {
    return this.opportunitiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOpportunityDto): Promise<Opportunity> {
    return this.opportunitiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.opportunitiesService.remove(id);
  }
}
