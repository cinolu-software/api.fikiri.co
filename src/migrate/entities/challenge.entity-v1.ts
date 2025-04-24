import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Solution } from './solution.entity-v1';
import { Thematic } from './thematic.entity-v1';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at?: Date;

  @ManyToMany(() => Solution, (solution) => solution.challenges)
  solutions: Solution[];

  @ManyToMany(() => Thematic, (thematic) => thematic.challenges)
  thematics: Thematic[];
}
