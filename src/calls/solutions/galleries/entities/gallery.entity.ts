import { BaseEntity } from 'src/shared/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Solution } from '../../entities/solution.entity';

@Entity()
export class SolutionGallery extends BaseEntity {
  @Column()
  image: string;

  @ManyToOne(() => Solution, (solution) => solution.gallery)
  @JoinColumn()
  solution: Solution;
}
