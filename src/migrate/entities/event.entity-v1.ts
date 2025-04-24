import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Solution } from './solution.entity-v1';
import { Thematic } from './thematic.entity-v1';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column()
  started_at: Date;

  @Column()
  ended_at: Date;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Solution, (solution) => solution.event)
  solutions: Solution[];

  @ManyToMany(() => Thematic, (thematic) => thematic.events)
  @JoinTable()
  thematics: Thematic[];
}
