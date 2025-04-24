import { Controller, Get } from '@nestjs/common';
import { MigrateUsersService } from './migrate-users.service';
import { MigrateEventsService } from './migrate-events.service';
import { MigrateSolutionsService } from './migrate-solutions.service';

@Controller('migrate')
export class MigrateController {
  constructor(
    private migrateUsersService: MigrateUsersService,
    private migrateEventsService: MigrateEventsService,
    private migrateSolutionsService: MigrateSolutionsService
  ) {}

  @Get('users')
  migrateUsers(): Promise<void> {
    return this.migrateUsersService.migrateUsers();
  }

  @Get('events')
  migrateEvents(): Promise<void> {
    return this.migrateEventsService.migrateEvents();
  }

  @Get('solutions')
  migrateSolutions(): Promise<void> {
    return this.migrateSolutionsService.migrateSolutions();
  }
}
