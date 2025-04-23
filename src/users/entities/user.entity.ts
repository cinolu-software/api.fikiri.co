import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { Role } from '../roles/entities/role.entity';
import { Post } from '../../blog/posts/entities/post.entity';
import { Comment } from '../../blog/comments/entities/comment.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Call } from '../../calls/entities/call.entity';
import { Solution } from '../../calls/solutions/entities/solution.entity';

@Entity()
export class User extends AbstractEntity {
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
  google_image: string;

  @Column({ nullable: true })
  profile: string;

  @OneToMany(() => Solution, (solution) => solution.user)
  solutions: Solution[];

  @OneToMany(() => Call, (call) => call.author)
  calls: Call[];

  @OneToMany(() => Call, (call) => call.publisher)
  published_calls: Call[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.by)
  comments: Comment[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => Organization)
  @JoinColumn()
  organization: Organization;
}
