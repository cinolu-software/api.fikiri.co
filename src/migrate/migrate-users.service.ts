import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as v1User } from './entities/user.entity-v1';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RolesService } from 'src/users/roles/roles.service';

@Injectable()
export class MigrateUsersService {
  constructor(
    @InjectRepository(v1User, 'v1')
    private readonly userRepository: Repository<v1User>,
    @InjectRepository(User)
    private readonly userRepositoryV2: Repository<User>,
    private readonly rolesService: RolesService
  ) {}

  async migrateUsers(): Promise<void> {
    const users = await this.userRepository.find();
    const role = await this.rolesService.findByName('user');
    users.map(async (user) => {
      const newUser = {
        email: user.email,
        password: user.password,
        address: user.address,
        name: user.name,
        phone_number: user.phone_number,
        created_at: user.created_at,
        updated_at: user.updated_at,
        google_image: user.google_image,
        profile: user.profile,
        roles: [role]
      };
      await this.userRepositoryV2.save(newUser);
    });
  }
}
