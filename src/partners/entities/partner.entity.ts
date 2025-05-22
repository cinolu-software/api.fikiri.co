import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/utils/base.entity';
import { PartnerType } from '../utils/enums/partner-type.enum';
import { callSolution } from '../../calls/entities/call.entity';

@Entity()
export class Partner extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'enum', enum: PartnerType })
  type: PartnerType;

  @ManyToOne(() => callSolution, { nullable: true })
  @JoinColumn()
  call?: callSolution;
}
