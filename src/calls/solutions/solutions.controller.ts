import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { CurrentUser } from '../../shared/decorators/user.decorator';
import { User } from '../../users/entities/user.entity';
import { Solution } from './entities/solution.entity';
import { Auth } from '../../shared/decorators/auth.decorators';
import { RoleEnum } from '../../shared/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('solutions')
@Auth(RoleEnum.User)
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateSolutionDto): Promise<Solution> {
    return this.solutionsService.create(user, dto);
  }

  @Post('map-solutions')
  @Auth(RoleEnum.Guest)
  mapSolutions() {
    return this.solutionsService.mapSolutions();
  }

  @Get('mapped')
  @Auth(RoleEnum.Guest)
  findMapped() {
    return this.solutionsService.findMapped();
  }

  @Post('image-profile/:id')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('thumb', {
      storage: diskStorage({
        destination: './uploads/solutions',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Solution> {
    return this.solutionsService.uploadImage(id, file);
  }

  @Get('reviewer/:token')
  @Auth(RoleEnum.Guest)
  findByReviewer(@Param('token') token: string) {
    return this.solutionsService.findByReviewer(token);
  }

  @Get('user/:id')
  @Auth(RoleEnum.User)
  findByUser(@Param('id') id: string) {
    return this.solutionsService.findByUser(id);
  }

  @Get('call/:id')
  @Auth(RoleEnum.Cartograph)
  findByCall(@Param('id') id: string) {
    return this.solutionsService.findByCall(id);
  }

  @Get()
  @Auth(RoleEnum.Cartograph)
  findAll() {
    return this.solutionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Solution> {
    return this.solutionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSolutionDto) {
    return this.solutionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.solutionsService.remove(id);
  }
}
