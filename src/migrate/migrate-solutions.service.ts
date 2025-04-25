import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solution as v1Solution } from './entities/solution.entity-v1';
import { Solution } from 'src/calls/solutions/entities/solution.entity';
import { User } from 'src/users/entities/user.entity';
import { Call } from 'src/calls/entities/call.entity';

@Injectable()
export class MigrateSolutionsService {
  constructor(
    @InjectRepository(v1Solution, 'v1')
    private readonly v1SolutionRepository: Repository<v1Solution>,
    @InjectRepository(Solution)
    private readonly v2SolutionRepository: Repository<Solution>,
    @InjectRepository(User)
    private readonly userRepositoryV2: Repository<User>,
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>
  ) {}

  async findAll(): Promise<v1Solution[]> {
    return await this.v1SolutionRepository.find({
      relations: ['thematic', 'images', 'user']
    });
  }

  async findWinningSolutions(): Promise<v1Solution[]> {
    return await this.v1SolutionRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.thematic', 'thematic')
      .leftJoinAndSelect('s.images', 'solutionImages')
      .leftJoinAndSelect('s.user', 'user')
      .leftJoin('s.status', 'status')
      .where('status.id IN (2,3,4)')
      .getMany();
  }

  async migrateSolutions(): Promise<void> {
    const solutions = await this.findAll();
    const calls = await this.callRepository.find();
    const winningSolutions = await this.findWinningSolutions();
    for (const s of solutions) {
      const user = await this.userRepositoryV2.findOne({
        where: { email: s.user.email }
      });
      const newSolution = {
        user,
        call: calls[0],
        created_at: s.created_at,
        updated_at: s.updated_at,
        responses: {
          name: s.name,
          video_link: s.video_link,
          description: s.description,
          targeted_problem: s.targeted_problem,
          thematic: s.thematic.name
        } as unknown as JSON,
        image: s.images.find(
          (i) => i.image_link.endsWith('.png') || i.image_link.endsWith('.jpg') || i.image_link.endsWith('.jpeg')
        )?.image_link
      };

      for (const w of winningSolutions) {
        if (s.id === w.id) {
          newSolution['award'] = calls[0];
        }
      }
      await this.v2SolutionRepository.save(newSolution);
    }
  }
}
