import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { SolutionsModule } from './solutions/solutions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { callSolution } from './entities/call.entity';
import { EmailModule } from '../email/email.module';
import { CallsGaleriesModule } from './galeries/galeries.module';

@Module({
  imports: [SolutionsModule, EmailModule, TypeOrmModule.forFeature([callSolution]), CallsGaleriesModule],
  controllers: [CallsController],
  providers: [CallsService]
})
export class CallsModule {}
