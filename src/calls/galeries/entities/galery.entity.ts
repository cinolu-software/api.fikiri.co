import { callSolution } from 'src/calls/entities/call.entity';
import { BaseEntity } from 'src/shared/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class CallGalery extends BaseEntity {
  @Column()
  image: string;

  @ManyToOne(() => callSolution, (call) => call.galery)
  @JoinColumn()
  call: callSolution;
}
