import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Solution } from '../../entities/solution.entity';
import { BaseEntity } from '../../../../shared/utils/base.entity';

@Entity()
export class Review extends BaseEntity {
  @Column()
  reviewer: string;

  @Column({ type: 'json', nullable: true })
  data: JSON;

  @ManyToOne(() => Solution)
  @JoinColumn()
  solution: Solution;
}
