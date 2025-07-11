import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import slugify from 'slugify';
import { callSolution } from '../entities/call.entity';

@EventSubscriber()
export class CallSubscriber implements EntitySubscriberInterface<callSolution> {
  listenTo() {
    return callSolution;
  }

  async beforeInsert(event: InsertEvent<callSolution>): Promise<void> {
    const { name } = event.entity;
    event.entity.slug = slugify(name, { lower: true });
  }

  async beforeUpdate(event: UpdateEvent<callSolution>): Promise<void> {
    const { name } = event.entity;
    if (!name) return;
    event.entity.slug = slugify(name, { lower: true });
  }
}
