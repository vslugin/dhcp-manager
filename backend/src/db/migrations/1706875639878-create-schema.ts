import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1706875639878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "gateways" (
                "id" varchar PRIMARY KEY NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                "name" varchar NOT NULL,
                "description" text NOT NULL,
                "ip_addr" varchar NOT NULL
            )
      `);

    await queryRunner.query(`
      CREATE TABLE "rooms" (
                "id" varchar PRIMARY KEY NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                "name" varchar NOT NULL,
                "description" text NOT NULL,
                "is_active" boolean NOT NULL DEFAULT (0)
            )
      `);

    await queryRunner.query(`
      CREATE TABLE "hosts" (
                "id" varchar PRIMARY KEY NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                "name" varchar NOT NULL,
                "description" text NOT NULL,
                "is_active" boolean NOT NULL DEFAULT (0),
                "ip_addr" varchar NOT NULL,
                "mac_addr" varchar NOT NULL,
                "gate_id" varchar NOT NULL,
                "room_id" varchar NOT NULL
            )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "gateways"
        `);
    await queryRunner.query(`
            DROP TABLE "rooms"
        `);
    await queryRunner.query(`
            DROP TABLE "hosts"
        `);
  }
}
