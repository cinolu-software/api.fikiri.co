import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/utils/base.entity';
import { Role } from '../roles/entities/role.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { callSolution } from '../../calls/entities/call.entity';
import { Solution } from '../../calls/solutions/entities/solution.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'json', nullable: true })
  socials: JSON;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  outreach_link: string;

  @Column({ nullable: true })
  outreacher: string;

  @Column({ nullable: true })
  google_image: string;

  @Column({ nullable: true })
  profile: string;

  @OneToMany(() => Solution, (solution) => solution.user)
  solutions: Solution[];

  @OneToMany(() => callSolution, (call) => call.author)
  calls: callSolution[];

  @OneToMany(() => callSolution, (call) => call.publisher)
  published_calls: callSolution[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => Organization)
  @JoinColumn()
  organization: Organization;
}
