import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailModule } from '../email/email.module';
import { UsersService } from './users.service';
import { RolesModule } from './roles/roles.module';
import { UserSubscriber } from './subscribers/user.subscriber';
import { OrganisationsModule } from './organizations/organizations.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule, RolesModule, OrganisationsModule],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService]
})
export class UsersModule {}
