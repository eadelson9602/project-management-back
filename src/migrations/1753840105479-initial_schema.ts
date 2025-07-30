import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1753840105479 implements MigrationInterface {
    name = 'InitialSchema1753840105479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('todo', 'in_progress', 'review', 'done')`);
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "status" "public"."task_status_enum" NOT NULL, "priority" "public"."task_priority_enum" NOT NULL, "estimatedHours" double precision NOT NULL, "actualHours" double precision, "dueDate" date NOT NULL, "projectId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "assignedToId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3399e2710196ea4bf734751558" ON "task" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_2fe7a278e6f08d2be55740a939" ON "task" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_f092f3386f10f2e2ef5b0b6ad1" ON "task" ("priority") `);
        await queryRunner.query(`CREATE INDEX "IDX_3797a20ef5553ae87af126bc2f" ON "task" ("projectId") `);
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum" AS ENUM('planning', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."project_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "status" "public"."project_status_enum" NOT NULL, "priority" "public"."project_priority_enum" NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "managerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dedfea394088ed136ddadeee89" ON "project" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_57856cedbec1fbed761154d162" ON "project" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_0daad8c8bfe716495f566a26d6" ON "project" ("priority") `);
        await queryRunner.query(`CREATE INDEX "IDX_33a588338bd946c9295c316d4b" ON "project" ("managerId") `);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'manager', 'developer')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "uid" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, "avatar" character varying, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_df955cae05f17b2bcf5045cc021" UNIQUE ("uid"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_developers" ("projectId" uuid NOT NULL, "developerId" uuid NOT NULL, CONSTRAINT "PK_abe93da3a131525ccaab6bf2c5a" PRIMARY KEY ("projectId", "developerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_76256baceb0a75f0e1298f0441" ON "project_developers" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_751a9b8add72e33066bf1659ef" ON "project_developers" ("developerId") `);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_fd5f652e2fcdc4a5ab30aaff7a7" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_33a588338bd946c9295c316d4bb" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_developers" ADD CONSTRAINT "FK_76256baceb0a75f0e1298f0441b" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_developers" ADD CONSTRAINT "FK_751a9b8add72e33066bf1659ef2" FOREIGN KEY ("developerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_developers" DROP CONSTRAINT "FK_751a9b8add72e33066bf1659ef2"`);
        await queryRunner.query(`ALTER TABLE "project_developers" DROP CONSTRAINT "FK_76256baceb0a75f0e1298f0441b"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_33a588338bd946c9295c316d4bb"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_fd5f652e2fcdc4a5ab30aaff7a7"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_751a9b8add72e33066bf1659ef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_76256baceb0a75f0e1298f0441"`);
        await queryRunner.query(`DROP TABLE "project_developers"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33a588338bd946c9295c316d4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0daad8c8bfe716495f566a26d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_57856cedbec1fbed761154d162"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dedfea394088ed136ddadeee89"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TYPE "public"."project_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3797a20ef5553ae87af126bc2f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f092f3386f10f2e2ef5b0b6ad1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fe7a278e6f08d2be55740a939"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3399e2710196ea4bf734751558"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    }

}
