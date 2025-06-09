import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { SolutionsModule } from './solutions/solutions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { callSolution } from './entities/call.entity';
import { EmailModule } from '../email/email.module';
import { CallsGalleriesModule } from './galleries/galleries.module';

@Module({
  imports: [SolutionsModule, EmailModule, TypeOrmModule.forFeature([callSolution]), CallsGalleriesModule],
  controllers: [CallsController],
  providers: [CallsService]
})
export class CallsModule {}
