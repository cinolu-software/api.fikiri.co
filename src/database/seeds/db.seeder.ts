import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/roles/entities/role.entity';
import { Opportunity } from '../../opportunities/entities/opportunity.entity';

export default class DbSeeder implements Seeder {
  async run(dataSource: DataSource) {
    /**
     * Truncate tables
     */
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.query('TRUNCATE TABLE user_roles_role;');
    await dataSource.query('TRUNCATE TABLE user;');
    await dataSource.query('TRUNCATE TABLE role;');
    await dataSource.query('TRUNCATE TABLE opportunity;');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

    /**
     * Get repositories
     */
    const roleRepository = dataSource.getRepository(Role);
    const opportunityRepository = dataSource.getRepository(Opportunity);
    const userRepository = dataSource.getRepository(User);

    ['admin', 'user', 'cartograph', 'explorator', 'experimentor'].map(async (role) => {
      await roleRepository.save({ name: role });
    });

    async function createOpportunities(users: User[], count: number) {
      return Promise.all(
        Array(count)
          .fill(0)
          .map(async () => {
            return await opportunityRepository.save({
              name: faker.company.buzzPhrase(),
              description: faker.commerce.productDescription(),
              ended_at: faker.helpers.arrayElement([faker.date.soon(), faker.date.past()]),
              started_at: faker.helpers.arrayElement([faker.date.recent(), faker.date.soon()]),
              published_at: faker.helpers.arrayElement([faker.date.recent(), faker.date.soon()]),
              author: faker.helpers.arrayElement(users),
              publisher: faker.helpers.arrayElement(users)
            });
          })
      );
    }

    async function createUsers(roleName: string, count: number) {
      const role = await roleRepository.findOneByOrFail({ name: roleName });
      return Promise.all(
        Array(count)
          .fill('')
          .map(async () => {
            return await userRepository.save({
              name: faker.person.firstName(),
              address: faker.location.streetAddress(),
              phone_number: faker.phone.number({ style: 'human' }),
              email: faker.internet.email(),
              verified_at: faker.date.recent(),
              password: await bcrypt.hash('admin1234', 10),
              roles: [role]
            });
          })
      );
    }

    await userRepository.save({
      name: faker.person.firstName(),
      address: faker.location.streetAddress(),
      phone_number: faker.phone.number({ style: 'human' }),
      email: 'admin@admin.com',
      verified_at: faker.date.recent(),
      password: await bcrypt.hash('admin1234', 10),
      roles: [await roleRepository.findOneByOrFail({ name: 'admin' })]
    });

    const cartographs = await createUsers('cartograph', 2);
    const explorators = await createUsers('explorator', 2);
    const experimentors = await createUsers('experimentor', 2);
    await createUsers('user', 200);
    await createOpportunities([...cartographs, ...explorators, ...experimentors], 200);
  }
}
