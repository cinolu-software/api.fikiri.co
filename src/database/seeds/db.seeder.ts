import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/roles/entities/role.entity';

export default class DbSeeder implements Seeder {
  async run(dataSource: DataSource) {
    dataSource.setOptions({
      database: 'fikiri'
    });
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);

    ['admin', 'user', 'cartograph', 'explorator', 'experimentor', 'volunteer'].map(async (role) => {
      await roleRepository.save({ name: role });
    });

    await userRepository.save({
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      phone_number: faker.phone.number({ style: 'human' }),
      email: 'admin@admin.com',
      verified_at: faker.date.recent(),
      password: await bcrypt.hash('admin1234', 10),
      roles: [await roleRepository.findOneByOrFail({ name: 'admin' })]
    });
  }
}
