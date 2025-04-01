import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Solution } from '../../entities/solution.entity';
import { AbstractEntity } from '../../../../shared/utils/abstract.entity';

@Entity()
export class Review extends AbstractEntity {
  @Column()
  reviewer: string;

  @Column({ type: 'json', nullable: true })
  data: JSON;

  @ManyToOne(() => Solution)
  @JoinColumn()
  solution: Solution;
}
