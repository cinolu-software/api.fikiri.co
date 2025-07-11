import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import slugify from 'slugify';
import { Solution } from '../entities/solution.entity';

@EventSubscriber()
export class SolutionSubscriber implements EntitySubscriberInterface<Solution> {
  listenTo() {
    return Solution;
  }

  async beforeInsert(event: InsertEvent<Solution>): Promise<void> {
    const { name } = event.entity;
    event.entity.slug = slugify(name, { lower: true });
  }

  async beforeUpdate(event: UpdateEvent<Solution>): Promise<void> {
    const { name } = event.entity;
    if (!name) return;
    event.entity.slug = slugify(name, { lower: true });
  }
}
