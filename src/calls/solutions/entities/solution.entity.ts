import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/utils/base.entity';
import { User } from '../../../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';
import { callSolution } from '../../entities/call.entity';
import { ESatus } from 'src/calls/utils/enums/status.enum';
import { SolutionGalery } from '../galeries/entities/galery.entity';

@Entity()
export class Solution extends BaseEntity {
  @Column({ type: 'json' })
  responses: JSON;

  @Column({ nullable: true })
  reviewer: string;

  @Column({ type: 'enum', enum: ESatus, default: ESatus.PENDING })
  status: ESatus;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Review, (review) => review.solution)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.solutions)
  @JoinColumn()
  user: User;

  @ManyToOne(() => callSolution, (call) => call.solutions)
  @JoinColumn()
  call: callSolution;

  @ManyToOne(() => callSolution, (call) => call.awards)
  @JoinColumn()
  award: callSolution;

  @OneToMany(() => SolutionGalery, (galery) => galery.solution)
  galery: SolutionGalery[];
}
