import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
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

@Controller('opportunities')
@Auth(RoleEnum.Cartograph)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  create(@CurrentUser() author: User, @Body() dto: CreateOpportunityDto): Promise<Opportunity> {
    return this.opportunitiesService.create(author, dto);
  }

  @Get('find-latest')
  @Auth(RoleEnum.Guest)
  findLatest(): Promise<Opportunity[]> {
    return this.opportunitiesService.findLatest();
  }

  @Post('find-reviewers/:id')
  findReviewers(@Param('id') id: string): Promise<addReviewerDto[]> {
    return this.opportunitiesService.findReviewers(id);
  }

  @Post('add-reviewer/:id')
  addReviwer(@Param('id') id: string, @Body() dto: addReviewerDto): Promise<{ call: Opportunity; token: string }> {
    return this.opportunitiesService.addReviewer(id, dto);
  }

  @Delete('delete-reviewer/:id')
  deleteReviewer(@Param('id') id: string, @Body('email') email: string): Promise<Opportunity> {
    return this.opportunitiesService.deleteReviewer(id, email);
  }

  @Post('resend-review-link/:email')
  resendReviewLink(@Param('email') email: string): Promise<string> {
    return this.opportunitiesService.resendReviewLink(email);
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
    FileInterceptor('thumb', {
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

  @Post('publish/:id')
  publish(@CurrentUser() publisher: User, @Param('id') id: string, @Body('date') date: Date): Promise<Opportunity> {
    return this.opportunitiesService.publish(publisher, id, date);
  }

  @Get('published')
  @Auth(RoleEnum.Guest)
  findPublished(): Promise<[Opportunity[], number]> {
    return this.opportunitiesService.findPublished();
  }

  @Get()
  findAll(): Promise<Opportunity[]> {
    return this.opportunitiesService.findAll();
  }

  @Get(':id')
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
