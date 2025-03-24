import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { ApplicationsModule } from './applications/applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ApplicationsModule, TypeOrmModule.forFeature([Call]), EmailModule],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService]
})
export class CallsModule {}
