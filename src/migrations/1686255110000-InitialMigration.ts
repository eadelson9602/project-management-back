import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1686255110000 implements MigrationInterface {
  name = 'InitialMigration1686255110000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL,
        "avatar" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "status" character varying NOT NULL,
        "priority" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "status" character varying NOT NULL,
        "priority" character varying NOT NULL,
        "estimated_hours" double precision NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "project_id" uuid,
        "assigned_to_id" uuid,
        CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("id"),
        CONSTRAINT "FK_project" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_assigned_to" FOREIGN KEY ("assigned_to_id") REFERENCES "users" ("id") ON DELETE SET NULL
      )
    `);

    // Add indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_project_id" ON "tasks" ("project_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_assigned_to_id" ON "tasks" ("assigned_to_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_assigned_to_id"`);
    await queryRunner.query(`DROP INDEX "IDX_project_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
