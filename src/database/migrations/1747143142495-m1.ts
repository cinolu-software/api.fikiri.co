import { MigrationInterface, QueryRunner } from 'typeorm';

export class M11747143142495 implements MigrationInterface {
  name = 'M11747143142495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`popularization_link\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`popularizer\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`popularizer\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`popularization_link\``);
  }
}
