import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Auth } from '../shared/decorators/auth.decorators';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { RoleEnum } from '../shared/enums/roles.enum';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create-user.dto';
import { Response } from 'express';
import { QueryParams } from './utils/types/query-params.type';

@Controller('users')
@Auth(RoleEnum.Cartographer)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('export/csv')
  async exportAllToCSV(@Res() res: Response) {
    await this.usersService.exportToCSV(res);
  }

  @Get('export/csv/outreachers')
  async exportOutreachersToCSV(@Res() res: Response) {
    await this.usersService.exportOutreachersToCSV(res);
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get('me/outreach-count')
  @Auth(RoleEnum.User)
  findOutreachCount(@CurrentUser() user: User): Promise<number> {
    return this.usersService.findOutreachCount(user);
  }

  @Get('outreachers/count')
  @Auth(RoleEnum.Volunteer)
  findUsersWithOutreachCount(@Query() queryParams: QueryParams): Promise<[User[], number]> {
    return this.usersService.findUsersWithOutreachCount(queryParams);
  }

  @Post('me/outreach-link')
  @Auth(RoleEnum.User)
  generateOutreachLink(@CurrentUser() user: User): Promise<User> {
    return this.usersService.generateOutreachLink(user);
  }

  @Get()
  findAll(@Query() queryParams: QueryParams): Promise<[User[], number]> {
    return this.usersService.findAll(queryParams);
  }

  @Get('role/:role')
  findByRole(@Param('role') role: string): Promise<User[]> {
    return this.usersService.findWithRole(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Post('me/profile-image')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('thumb', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (_req, file, cb) => cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`)
      })
    })
  )
  uploadImage(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<User> {
    return this.usersService.uploadImage(user, file);
  }

  @Delete(':id')
  @Auth(RoleEnum.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
