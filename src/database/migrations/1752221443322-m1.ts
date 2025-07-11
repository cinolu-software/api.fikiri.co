import { MigrationInterface, QueryRunner } from 'typeorm';

export class M11752221443322 implements MigrationInterface {
  name = 'M11752221443322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`solution\` ADD \`name\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` ADD \`slug\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` ADD \`slug\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` ADD \`description\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` ADD \`problem_solved\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`problem_solved\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`description\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`slug\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`slug\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`name\``);
  }
}
