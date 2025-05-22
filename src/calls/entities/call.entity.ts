import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/utils/base.entity';
import { User } from '../../users/entities/user.entity';
import { Partner } from '../../partners/entities/partner.entity';
import { Solution } from '../solutions/entities/solution.entity';
import { CallGalery } from '../galeries/entities/galery.entity';

@Entity()
export class callSolution extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  ended_at: Date;

  @Column({ type: 'datetime' })
  started_at: Date;

  @Column({ type: 'datetime', nullable: true })
  published_at: Date;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  document: string;

  @Column({ type: 'json', nullable: true })
  form: JSON;

  @Column({ type: 'json', nullable: true })
  review_form: JSON;

  @Column({ type: 'json', nullable: true })
  reviewers: JSON;

  @Column({ type: 'json', nullable: true })
  requirements: JSON;

  @Column({ type: 'json', nullable: true })
  contact_form: JSON;

  @ManyToOne(() => User, (author) => author.calls)
  @JoinColumn()
  author: User;

  @ManyToOne(() => User, (publisher) => publisher.published_calls)
  @JoinColumn()
  publisher: User;

  @OneToMany(() => Partner, (partner) => partner.call)
  partners: Partner[];

  @OneToMany(() => Solution, (solution) => solution.award)
  awards: Solution[];

  @OneToMany(() => Solution, (solution) => solution.call)
  solutions: Solution[];

  @OneToMany(() => CallGalery, (galery) => galery.call)
  galery: CallGalery[];
}
