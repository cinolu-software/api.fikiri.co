import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { AbstractEntity } from '../../../../shared/utils/abstract.entity';

@Entity()
export class Review extends AbstractEntity {
  @Column({ type: 'double', precision: 2 })
  note: number;

  @Column()
  reviewer: string;

  @Column({ type: 'json', nullable: true })
  data: string;

  @ManyToOne(() => Application)
  @JoinColumn()
  application: Application;
}
