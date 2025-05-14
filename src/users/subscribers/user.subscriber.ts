import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(private jwtService: JwtService) {}

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const user = event.entity;
    if (!user.password) return;
    user.password = await bcrypt.hash(user.password, 10);
    user.popularization_link = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: '30d' }
    );
  }
}
