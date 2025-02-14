import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { Call } from './entities/call.entity';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '../shared/decorators/auth.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { addReviewerDto } from './dto/add-reviewer.dto';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  create(@CurrentUser() author: User, @Body() dto: CreateCallDto): Promise<Call> {
    return this.callsService.create(author, dto);
  }

  @Post('find-reviewers/:id')
  findReviewers(@Param('id') id: string): Promise<addReviewerDto[]> {
    return this.callsService.findReviewers(id);
  }

  @Post('add-reviewer/:id')
  addReviwer(@Param('id') id: string, @Body() dto: addReviewerDto): Promise<{ call: Call; token: string }> {
    return this.callsService.addReviewer(id, dto);
  }

  @Delete('delete-reviewer/:id')
  deleteReviewer(@Param('id') id: string, @Body('email') email: string): Promise<Call> {
    return this.callsService.deleteReviewer(id, email);
  }

  @Post('resend-review-link/:email')
  resendReviewLink(@Param('email') email: string): Promise<string> {
    return this.callsService.resendReviewLink(email);
  }

  @Post('cover/:id')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/calls/covers',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  addCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Call> {
    return this.callsService.addCover(id, file);
  }

  @Post('document/:id')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('thumb', {
      storage: diskStorage({
        destination: './uploads/calls/documents',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  addDocument(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Call> {
    return this.callsService.addDocument(id, file);
  }

  @Post('publish/:id')
  publish(@CurrentUser() publisher: User, @Param('id') id: string): Promise<Call> {
    return this.callsService.publish(publisher, id);
  }

  @Get('published')
  findPublished(): Promise<Call[]> {
    return this.callsService.findPublished();
  }

  @Get()
  findAll(): Promise<Call[]> {
    return this.callsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Call> {
    return this.callsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCallDto): Promise<Call> {
    return this.callsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.callsService.remove(id);
  }
}
