import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { SolutionsModule } from './solutions/solutions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [SolutionsModule, EmailModule, TypeOrmModule.forFeature([Call])],
  controllers: [CallsController],
  providers: [CallsService]
})
export class CallsModule {}
