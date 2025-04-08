import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
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

  @Get('')
  findAll(): Promise<User[]> {
    return this.userService.findAll();
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
