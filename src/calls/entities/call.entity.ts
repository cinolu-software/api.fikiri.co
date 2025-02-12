import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Call extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  published_at: Date;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  document: string;

  @Column({ type: 'json', nullable: true })
  form: JSON;

  @ManyToOne(() => User, (author) => author.calls)
  @JoinColumn()
  author: User;

  @ManyToOne(() => User, (publisher) => publisher.published_calls)
  @JoinColumn()
  publisher: User;
}
