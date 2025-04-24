import { Controller, Get } from '@nestjs/common';
import { MigrateUsersService } from './migrate-users.service';

@Controller('migrate')
export class MigrateController {
  constructor(private readonly migrateUsersService: MigrateUsersService) {}

  @Get('users')
  migrateUsers(): Promise<void> {
    return this.migrateUsersService.migrateUsers();
  }
}
