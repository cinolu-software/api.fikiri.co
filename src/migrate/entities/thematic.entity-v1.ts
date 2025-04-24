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
import { Event } from './event.entity-v1';
import { Challenge } from './challenge.entity-v1';

@Entity()
export class Thematic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column()
  odds: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Solution, (solution) => solution.thematic)
  solutions: Solution[];

  @ManyToMany(() => Event, (events) => events.thematics)
  events: Event[];

  @ManyToMany(() => Challenge, (challenge) => challenge.thematics)
  @JoinTable()
  challenges: Challenge[];
}
