import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../shared/utils/abstract.entity';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class Application extends AbstractEntity {
  @Column({ type: 'json', nullable: true })
  responses: JSON;

  @Column({ nullable: true })
  document: string;

  @ManyToOne(() => User, (applicant) => applicant.applications)
  @JoinColumn()
  applicant: User;
}
