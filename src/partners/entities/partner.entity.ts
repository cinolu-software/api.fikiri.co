import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { PartnerType } from '../utils/enums/partner-type.enum';
import { Opportunity } from '../../opportunities/entities/opportunity.entity';

@Entity()
export class Partner extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'enum', enum: PartnerType })
  type: PartnerType;

  @ManyToOne(() => Opportunity, { nullable: true })
  @JoinColumn()
  opportunity?: Opportunity;
}
