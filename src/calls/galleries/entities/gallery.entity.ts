import { callSolution } from 'src/calls/entities/call.entity';
import { BaseEntity } from 'src/shared/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class CallGallery extends BaseEntity {
  @Column()
  image: string;

  @ManyToOne(() => callSolution, (call) => call.gallery)
  @JoinColumn()
  call: callSolution;
}
