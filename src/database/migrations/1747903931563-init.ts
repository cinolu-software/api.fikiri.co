import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1747903931563 implements MigrationInterface {
  name = 'Init1747903931563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP FOREIGN KEY \`FK_d6cd5f444187e15e1cbc6464cf6\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP FOREIGN KEY \`FK_f66575735584918e6f8da250604\``);
    await queryRunner.query(
      `CREATE TABLE \`solution_gallery\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`image\` varchar(255) NOT NULL, \`solutionId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`call_gallery\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`image\` varchar(255) NOT NULL, \`callId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`role\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`organization\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`partner\` DROP FOREIGN KEY \`FK_8aef3f06fd8d7a645cc2b9fdf21\``);
    await queryRunner.query(`ALTER TABLE \`partner\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`partner\` CHANGE \`link\` \`link\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`partner\` CHANGE \`logo\` \`logo\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`partner\` CHANGE \`callId\` \`callId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_cb2eff561603c229ad4bce0fb0a\``);
    await queryRunner.query(`ALTER TABLE \`review\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`data\``);
    await queryRunner.query(`ALTER TABLE \`review\` ADD \`data\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`review\` CHANGE \`solutionId\` \`solutionId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_577971bf35a3f85b2d6edd8329e\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_a6d648bdb9da84b174d72b5d9c1\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_a4120c4fb94efaef567362bc42b\``);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`reviewer\` \`reviewer\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`image\` \`image\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`userId\` \`userId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`callId\` \`callId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`awardId\` \`awardId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` CHANGE \`published_at\` \`published_at\` datetime NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` CHANGE \`cover\` \`cover\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` CHANGE \`document\` \`document\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`form\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` ADD \`form\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`review_form\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` ADD \`review_form\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`reviewers\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` ADD \`reviewers\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`requirements\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` ADD \`requirements\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`contact_form\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` ADD \`contact_form\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` CHANGE \`authorId\` \`authorId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`call_solution\` CHANGE \`publisherId\` \`publisherId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_dfda472c0af7812401e592b6a61\``);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone_number\` \`phone_number\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`bio\` \`bio\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`socials\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`socials\` json NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`outreach_link\` \`outreach_link\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`outreacher\` \`outreacher\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`google_image\` \`google_image\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profile\` \`profile\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`organizationId\` \`organizationId\` varchar(36) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`partner\` ADD CONSTRAINT \`FK_8aef3f06fd8d7a645cc2b9fdf21\` FOREIGN KEY (\`callId\`) REFERENCES \`call_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_cb2eff561603c229ad4bce0fb0a\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_gallery\` ADD CONSTRAINT \`FK_886108c635208f12c6cf2b8e7a8\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_577971bf35a3f85b2d6edd8329e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_a6d648bdb9da84b174d72b5d9c1\` FOREIGN KEY (\`callId\`) REFERENCES \`call_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_a4120c4fb94efaef567362bc42b\` FOREIGN KEY (\`awardId\`) REFERENCES \`call_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_gallery\` ADD CONSTRAINT \`FK_2b7f3b5895806192176f409be19\` FOREIGN KEY (\`callId\`) REFERENCES \`call_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD CONSTRAINT \`FK_624d359f9eb6f51f50374f85a61\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD CONSTRAINT \`FK_fd7e41f687e8a2fb019f1246105\` FOREIGN KEY (\`publisherId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_dfda472c0af7812401e592b6a61\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_dfda472c0af7812401e592b6a61\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP FOREIGN KEY \`FK_fd7e41f687e8a2fb019f1246105\``);
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP FOREIGN KEY \`FK_624d359f9eb6f51f50374f85a61\``);
    await queryRunner.query(`ALTER TABLE \`call_gallery\` DROP FOREIGN KEY \`FK_2b7f3b5895806192176f409be19\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_a4120c4fb94efaef567362bc42b\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_a6d648bdb9da84b174d72b5d9c1\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_577971bf35a3f85b2d6edd8329e\``);
    await queryRunner.query(`ALTER TABLE \`solution_gallery\` DROP FOREIGN KEY \`FK_886108c635208f12c6cf2b8e7a8\``);
    await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_cb2eff561603c229ad4bce0fb0a\``);
    await queryRunner.query(`ALTER TABLE \`partner\` DROP FOREIGN KEY \`FK_8aef3f06fd8d7a645cc2b9fdf21\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`organizationId\` \`organizationId\` varchar(36) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profile\` \`profile\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`google_image\` \`google_image\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`outreacher\` \`outreacher\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`outreach_link\` \`outreach_link\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`socials\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`socials\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`bio\` \`bio\` text NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`phone_number\` \`phone_number\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_dfda472c0af7812401e592b6a61\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` CHANGE \`publisherId\` \`publisherId\` varchar(36) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` CHANGE \`authorId\` \`authorId\` varchar(36) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`contact_form\``);
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD \`contact_form\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`requirements\``);
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD \`requirements\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`reviewers\``);
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD \`reviewers\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`review_form\``);
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD \`review_form\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`call_solution\` DROP COLUMN \`form\``);
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD \`form\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` CHANGE \`document\` \`document\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` CHANGE \`cover\` \`cover\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` CHANGE \`published_at\` \`published_at\` datetime NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`awardId\` \`awardId\` varchar(36) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`callId\` \`callId\` varchar(36) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`reviewer\` \`reviewer\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_a4120c4fb94efaef567362bc42b\` FOREIGN KEY (\`awardId\`) REFERENCES \`call_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_a6d648bdb9da84b174d72b5d9c1\` FOREIGN KEY (\`callId\`) REFERENCES \`call_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_577971bf35a3f85b2d6edd8329e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` CHANGE \`solutionId\` \`solutionId\` varchar(36) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`data\``);
    await queryRunner.query(`ALTER TABLE \`review\` ADD \`data\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`review\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_cb2eff561603c229ad4bce0fb0a\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE \`partner\` CHANGE \`callId\` \`callId\` varchar(36) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`partner\` CHANGE \`logo\` \`logo\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`partner\` CHANGE \`link\` \`link\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`partner\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`partner\` ADD CONSTRAINT \`FK_8aef3f06fd8d7a645cc2b9fdf21\` FOREIGN KEY (\`callId\`) REFERENCES \`call_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`DROP TABLE \`call_gallery\``);
    await queryRunner.query(`DROP TABLE \`solution_gallery\``);
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD CONSTRAINT \`FK_f66575735584918e6f8da250604\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`call_solution\` ADD CONSTRAINT \`FK_d6cd5f444187e15e1cbc6464cf6\` FOREIGN KEY (\`publisherId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
