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
import { QueryParams } from './utils/types/query-params.type';
import { IReviewer } from './utils/types/reviewer.type';
import { IForm } from './utils/types/form.type';

@Controller('calls')
@Auth(RoleEnum.Cartograph)
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  create(@CurrentUser() author: User, @Body() dto: CreateCallDto): Promise<Call> {
    return this.callsService.create(author, dto);
  }

  @Post('awards/:id')
  awards(@Param('id') id: string, @Body('solutionsIds') solutionsIds: string[]): Promise<Call> {
    return this.callsService.awards(id, solutionsIds);
  }

  @Get('find-unpublished')
  @Auth(RoleEnum.Guest)
  findUnpublished(@Query() queryParams: QueryParams): Promise<[Call[], number]> {
    return this.callsService.findUnpublished(queryParams);
  }

  @Get('find-published')
  @Auth(RoleEnum.Guest)
  findPublished(@Query() queryParams: QueryParams): Promise<[Call[], number]> {
    return this.callsService.findPublished(queryParams);
  }

  @Get('find-latest')
  @Auth(RoleEnum.Guest)
  findLatest(): Promise<Call[]> {
    return this.callsService.findLatest();
  }

  @Get('find-review-form/:token')
  @Auth(RoleEnum.Guest)
  findReviewForm(@Param('token') token: string): Promise<IForm> {
    return this.callsService.findReviewForm(token);
  }

  @Get('find-reviewers/:id')
  findReviewers(@Param('id') id: string): Promise<IReviewer[]> {
    return this.callsService.findReviewers(id);
  }

  @Post('add-reviewer/:id')
  addReviwer(@Param('id') id: string, @Body() dto: IReviewer): Promise<Call> {
    return this.callsService.addReviewer(id, dto);
  }

  @Patch('update-reviewer/:id/:email')
  updateReviewer(@Param() params: unknown, @Body() dto: IReviewer): Promise<Call> {
    return this.callsService.updateReviewer(params['id'], params['email'], dto);
  }

  @Delete('delete-reviewer/:id')
  deleteReviewer(@Param('id') id: string, @Body('email') email: string): Promise<Call> {
    return this.callsService.deleteReviewer(id, email);
  }

  @Post('resend-review-link/:id/:email')
  resendReviewLink(@Param() params: unknown): Promise<void> {
    return this.callsService.resendReviewLink(params['id'], params['email']);
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
    FileInterceptor('doc', {
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

  @Post('unpublish/:id')
  unpublish(@Param('id') id: string): Promise<Call> {
    return this.callsService.unpublish(id);
  }

  @Post('publish/:id')
  publish(@CurrentUser() publisher: User, @Param('id') id: string): Promise<Call> {
    return this.callsService.publish(publisher, id);
  }

  @Get()
  @Auth(RoleEnum.Guest)
  findAll(): Promise<Call[]> {
    return this.callsService.findAll();
  }

  @Get(':id')
  @Auth(RoleEnum.Guest)
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
