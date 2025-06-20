import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

@Controller('users')
@Auth(RoleEnum.Cartograph)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('')
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Get('count-by-outreacher/:outreacher')
  @Auth(RoleEnum.User)
  countByOutreach(@Param('outreacher') outreacher: string): Promise<number> {
    return this.userService.countByOutreach(outreacher);
  }

  @Get('count-by-outreachers')
  @Auth(RoleEnum.Volunteer)
  countByOutreachers(): Promise<{ outreacher: string; count: number }[]> {
    return this.userService.countByOutreachers();
  }

  @Post('generate-outreach-link')
  @Auth(RoleEnum.User)
  generateOutreachLink(@CurrentUser() user: User): Promise<User> {
    return this.userService.generateOutreachLink(user);
  }

  @Get('find-by-outreacher/:outreacher')
  @Auth(RoleEnum.User)
  findByOutreacher(@Param('outreacher') outreacher: string): Promise<User[]> {
    return this.userService.findByOutreacher(outreacher);
  }

  @Get('')
  findAll(@Query('page') page: string): Promise<[User[], number]> {
    return this.userService.findAll(+page);
  }

  @Get('with-role/:role')
  findAdmins(@Param() role: string): Promise<User[]> {
    return this.userService.findWithRole(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch('update-many')
  @Auth(RoleEnum.Admin)
  updateMany(@Body() dto: { ids: string[]; data: UpdateUserDto[] }): Promise<User[]> {
    return this.userService.updateMany(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Post('image-profile')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('thumb', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  uploadImage(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<User> {
    return this.userService.uploadImage(user, file);
  }

  @Delete(':id')
  @Auth(RoleEnum.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
