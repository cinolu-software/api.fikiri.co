import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Detail } from '../details/entities/detail.entity';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { Role } from '../roles/entities/role.entity';
import { Post } from '../../blog/posts/entities/post.entity';
import { Comment } from '../../blog/comments/entities/comment.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Opportunity } from '../../opportunities/entities/opportunity.entity';
import { Application } from '../../opportunities/applications/entities/application.entity';

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

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  google_image: string;

  @Column({ nullable: true })
  profile: string;

  @Column({ type: 'datetime', nullable: true, default: null })
  verified_at: Date;

  @OneToMany(() => Application, (application) => application.applicant)
  applications: Application[];

  @OneToMany(() => Opportunity, (call) => call.author)
  calls: Opportunity[];

  @OneToMany(() => Opportunity, (call) => call.publisher)
  published_calls: Opportunity[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.by)
  comments: Comment[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @OneToOne(() => Detail, (detail) => detail.user)
  @JoinColumn()
  detail: Detail;

  @ManyToMany(() => Organization)
  @JoinColumn()
  organisation: Organization;
}
