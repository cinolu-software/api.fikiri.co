import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/roles/entities/role.entity';
import { Call } from '../../calls/entities/call.entity';
import { Application } from '../../calls/applications/entities/application.entity';
import { Organization } from '../../users/organizations/entities/organization.entity';

type FieldType = 'text' | 'select' | 'number' | 'textarea';

interface Field {
  id: number;
  type: FieldType;
  label: string;
  options: string[];
  required: boolean;
}

export default class DbSeeder implements Seeder {
  async run(dataSource: DataSource) {
    /**
     * Truncate tables
     */
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.query('TRUNCATE TABLE user_roles_role;');
    await dataSource.query('TRUNCATE TABLE user;');
    await dataSource.query('TRUNCATE TABLE role;');
    await dataSource.query('TRUNCATE TABLE call;');
    await dataSource.query('TRUNCATE TABLE organization;');
    await dataSource.query('TRUNCATE TABLE application;');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

    /**
     * Get repositories
     */
    const roleRepository = dataSource.getRepository(Role);
    const callRepository = dataSource.getRepository(Call);
    const applicationRepository = dataSource.getRepository(Application);
    const organizationRepository = dataSource.getRepository(Organization);
    const userRepository = dataSource.getRepository(User);

    ['admin', 'user', 'cartograph', 'explorator', 'experimentor'].map(async (role) => {
      await roleRepository.save({ name: role });
    });

    async function generateOrganizations(count: number): Promise<Organization[]> {
      return Promise.all(
        Array.from(
          { length: count },
          async () =>
            await organizationRepository.save({
              name: faker.company.buzzNoun()
            })
        )
      );
    }

    function createReviewers(organizations: Organization[], count: number) {
      return Array.from({ length: count }, () => {
        return {
          email: faker.internet.email(),
          organization: faker.helpers.arrayElement(organizations.map((o) => o.name)),
          solution: faker.number.int({ min: 3, max: 5 })
        };
      });
    }

    async function createcalls(users: User[], count: number) {
      const organizations = await generateOrganizations(10);
      function generateFields(count: number): Field[] {
        return Array.from({ length: count }, () => {
          const type: FieldType = faker.helpers.arrayElement(['text', 'select', 'number', 'textarea']);
          const options = type === 'select' ? Array.from({ length: 4 }, () => faker.word.sample(10)) : [''];
          return {
            id: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
            type,
            options,
            label: faker.word.words(10),
            required: faker.datatype.boolean()
          };
        });
      }
      function generateReviewForm(count: number) {
        return Array.from({ length: count }, () => {
          const type: FieldType = faker.helpers.arrayElement(['number', 'textarea']);
          return {
            id: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
            type,
            label: faker.word.words(10),
            description: faker.lorem.sentence(),
            required: faker.datatype.boolean()
          };
        });
      }
      return Promise.all(
        Array.from(
          { length: count },
          async () =>
            await callRepository.save({
              name: faker.company.buzzPhrase(),
              description: faker.commerce.productDescription(),
              ended_at: faker.date.soon(),
              started_at: faker.date.recent(),
              published_at: faker.helpers.arrayElement([faker.date.recent(), faker.date.soon()]),
              author: faker.helpers.arrayElement(users),
              publisher: faker.helpers.arrayElement(users),
              reviewers: createReviewers(organizations, faker.number.int({ min: 3, max: 5 })) as unknown as JSON,
              form: generateFields(faker.number.int({ min: 3, max: 5 })) as unknown as JSON,
              review_form: generateReviewForm(faker.number.int({ min: 3, max: 5 })) as unknown as JSON,
              contact_form: generateFields(faker.number.int({ min: 3, max: 5 })) as unknown as JSON
            })
        )
      );
    }

    async function createApplications(users: User[], calls: Call[], count: number) {
      function generateResponses(count: number) {
        return Array.from({ length: count }, () => {
          const label = faker.word.words(10);
          const value = faker.helpers.arrayElement([faker.word.words(10)]);
          return { [label]: value };
        });
      }
      return Promise.all(
        Array.from(
          { length: count },
          async () =>
            await applicationRepository.save({
              applicant: faker.helpers.arrayElement(users),
              responses: generateResponses(faker.number.int({ min: 3, max: 5 })) as unknown as JSON,
              call: faker.helpers.arrayElement(calls)
            })
        )
      );
    }

    async function createUsers(roleName: string, count: number) {
      const role = await roleRepository.findOneByOrFail({ name: roleName });
      return Promise.all(
        Array.from(
          { length: count },
          async () =>
            await userRepository.save({
              name: faker.person.firstName(),
              address: faker.location.streetAddress(),
              phone_number: faker.phone.number({ style: 'human' }),
              email: faker.internet.email(),
              verified_at: faker.date.recent(),
              password: await bcrypt.hash('admin1234', 10),
              roles: [role]
            })
        )
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
    const users = await createUsers('user', 200);
    const calls = await createcalls([...cartographs, ...explorators, ...experimentors], 200);
    await createApplications(users, calls, 200);
  }
}
