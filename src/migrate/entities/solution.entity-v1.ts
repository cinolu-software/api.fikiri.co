import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Event } from './event.entity-v1';
import { Challenge } from './challenge.entity-v1';
import { Thematic } from './thematic.entity-v1';
import { Image } from './image.entity-v1';
import { User } from './user.entity-v1';
import { Status } from './status.entity-v1';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ nullable: true })
  video_link: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  targeted_problem: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.solutions)
  @JoinColumn()
  event: Event;

  @ManyToMany(() => Challenge, (challenge) => challenge.solutions)
  @JoinTable()
  challenges: Challenge[];

  @ManyToOne(() => Thematic, (thematic) => thematic.solutions)
  @JoinColumn()
  thematic: Thematic;

  @OneToMany(() => Image, (image) => image.solution)
  images: Image[];

  @ManyToOne(() => User, (user) => user.solutions)
  user: User;

  @ManyToOne(() => Status, (status) => status.solutions)
  @JoinColumn()
  status: Status;
}
