import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event as v1Event } from './entities/event.entity-v1';
import { Call } from 'src/calls/entities/call.entity';

@Injectable()
export class MigrateEventsService {
  constructor(
    @InjectRepository(Event, 'v1')
    private readonly eventRepository: Repository<v1Event>,
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>
  ) {}

  async migrateEvents(): Promise<void> {
    const events = await this.eventRepository.find();
    events.map(async (event) => {
      const newEvent = {
        name: event.name.toLocaleLowerCase().charAt(0).toUpperCase() + event.name.slice(1),
        description: event.description,
        ended_at: event.ended_at,
        started_at: event.started_at,
        published_at: event.started_at
      };
      await this.callRepository.save(newEvent);
    });
  }
}
