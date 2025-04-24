import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solution as v1Solution } from './entities/solution.entity-v1';
import { Solution } from 'src/calls/solutions/entities/solution.entity';
import * as fs from 'fs-extra';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MigrateSolutionsService {
  constructor(
    @InjectRepository(v1Solution, 'v1')
    private readonly v1SolutionRepository: Repository<v1Solution>,
    @InjectRepository(Solution)
    private readonly v2SolutionRepository: Repository<Solution>,
    @InjectRepository(User)
    private readonly userRepositoryV2: Repository<User>
  ) {}

  async findAll(): Promise<v1Solution[]> {
    return await this.v1SolutionRepository.find({
      relations: ['thematic', 'images', 'user']
    });
  }

  async migrateSolutions(): Promise<void> {
    const solutions = await this.findAll();
    const imgs = await fs.readdir('./uploads/solutions');

    const solutionsImgs = solutions
      .map(
        (s) =>
          s.images.find(
            (i) => i.image_link.endsWith('.png') || i.image_link.endsWith('.jpg') || i.image_link.endsWith('.jpeg')
          )?.image_link
      )
      .filter(Boolean);

    for (const img of imgs) {
      if (!solutionsImgs.includes(img)) {
        await fs.unlink(`./uploads/solutions/${img}`);
        console.log(`Deleted unused image: ${img}`);
      }
    }

    for (const s of solutions) {
      const user = await this.userRepositoryV2.findOne({
        where: { email: s.user.email }
      });
      const newSolution = {
        user,
        call: {
          id: 'f94b1e75-e9bf-47fd-a521-30394e3c2980'
        },
        responses: {
          name: s.name,
          video_link: s.video_link,
          description: s.description,
          targeted_problem: s.targeted_problem,
          created_at: s.created_at,
          updated_at: s.updated_at,
          thematic: s.thematic.name
        } as unknown as JSON,
        image: s.images.find(
          (i) => i.image_link.endsWith('.png') || i.image_link.endsWith('.jpg') || i.image_link.endsWith('.jpeg')
        )?.image_link
      };
      await this.v2SolutionRepository.save(newSolution);
    }
  }
}
