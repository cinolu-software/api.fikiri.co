import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { ApplicationsModule } from './applications/applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';

@Module({
  imports: [ApplicationsModule, TypeOrmModule.forFeature([Call])],
  controllers: [CallsController],
  providers: [CallsService]
})
export class CallsModule {}
