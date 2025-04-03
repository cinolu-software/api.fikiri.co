import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { RoleEnum } from 'src/shared/enums/roles.enum';
import { IAdminStats } from './utils/types/admin.type';

@Controller('stats')
@Auth(RoleEnum.Cartograph)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('admin-stats')
  getAdminStats(): Promise<IAdminStats> {
    return this.statsService.getAdminStats();
  }
}
