import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../../entities/user.entity';
import { AbstractEntity } from '../../../shared/utils/abstract.entity';

@Entity()
export class Detail extends AbstractEntity {
  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'json', nullable: true })
  socials: JSON;

  @OneToOne(() => User, (user) => user.detail)
  user: User;
}
