import { Module } from '@nestjs/common';
import { MigrateUsersService } from './migrate-users.service';
import { MigrateController } from './migrate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as v1User } from './entities/user.entity-v1';
import { User } from 'src/users/entities/user.entity';
import { RolesModule } from 'src/users/roles/roles.module';
import { Solution as v1Solution } from './entities/solution.entity-v1';
import { Event as v1Event } from './entities/event.entity-v1';
import { Solution } from 'src/calls/solutions/entities/solution.entity';
import { Call } from 'src/calls/entities/call.entity';
import { MigrateEventsService } from './migrate-events.service';
import { MigrateSolutionsService } from './migrate-solutions.service';
import { Thematic } from './entities/thematic.entity-v1';
import { Challenge } from './entities/challenge.entity-v1';
import { Image } from './entities/image.entity-v1';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Solution, Call]),
    TypeOrmModule.forFeature([v1User, v1Solution, v1Event, Thematic, Challenge, Image], 'v1'),
    RolesModule
  ],
  controllers: [MigrateController],
  providers: [MigrateUsersService, MigrateEventsService, MigrateSolutionsService]
})
export class MigrateModule {}
