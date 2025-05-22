import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/utils/base.entity';
import { User } from '../../entities/user.entity';

@Entity()
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.organization)
  user: User;
}
