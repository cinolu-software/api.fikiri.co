import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../shared/utils/abstract.entity';
import { User } from '../../../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';

@Entity()
export class Application extends AbstractEntity {
  @Column({ type: 'json', nullable: true })
  responses: string;

  @Column({ nullable: true })
  document: string;

  @OneToMany(() => Review, (review) => review.application)
  reviews: Review[];

  @ManyToOne(() => User, (applicant) => applicant.applications)
  @JoinColumn()
  applicant: User;
}
