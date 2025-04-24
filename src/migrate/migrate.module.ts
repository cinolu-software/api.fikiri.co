import { Module } from '@nestjs/common';
import { MigrateUsersService } from './migrate-users.service';
import { MigrateController } from './migrate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as v1User } from './entities/user.entity-v1';
import { User } from 'src/users/entities/user.entity';
import { RolesModule } from 'src/users/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([v1User], 'v1'), RolesModule],
  controllers: [MigrateController],
  providers: [MigrateUsersService]
})
export class MigrateModule {}
