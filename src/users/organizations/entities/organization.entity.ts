import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../shared/utils/abstract.entity';
import { User } from '../../entities/user.entity';

@Entity()
export class Organization extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.organisation)
  user: User;
}
