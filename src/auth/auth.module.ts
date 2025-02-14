import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './session.serializer';
import { EmailModule } from '../email/email.module';
import { RightsService } from './rights.service';
import { UsersModule } from '../users/users.module';
import { CallsModule } from '../calls/calls.module';

@Module({
  imports: [PassportModule, UsersModule, EmailModule, CallsModule],
  controllers: [AuthController],
  providers: [AuthService, RightsService, LocalStrategy, SessionSerializer, GoogleStrategy],
  exports: [RightsService, AuthService]
})
export class AuthModule {}
