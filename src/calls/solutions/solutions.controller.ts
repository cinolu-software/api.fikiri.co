import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { CurrentUser } from '../../shared/decorators/user.decorator';
import { User } from '../../users/entities/user.entity';
import { Solution } from './entities/solution.entity';
import { Auth } from '../../shared/decorators/auth.decorators';
import { RoleEnum } from '../../shared/enums/roles.enum';

@Controller('solutions')
@Auth(RoleEnum.User)
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateSolutionDto): Promise<Solution> {
    return this.solutionsService.create(user, dto);
  }

  @Get('reviewer/:token')
  @Auth(RoleEnum.Guest)
  findByUser(@Param('token') token: string) {
    return this.solutionsService.findByReviewer(token);
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
