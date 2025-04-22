import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../shared/utils/abstract.entity';
import { User } from '../../../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';
import { Call } from '../../entities/call.entity';

@Entity()
export class Solution extends AbstractEntity {
  @Column({ type: 'json' })
  responses: JSON;

  @Column({ nullable: true })
  reviewer: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Review, (review) => review.solution)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.solutions)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Call)
  @JoinColumn()
  call: Call;
}
