import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsTableName: 'migrations',
});

// CLI configuration for TypeORM
export const cli = {
  migrationsDir: 'src/migrations',
  entitiesDir: 'src',
  migrationsTableName: 'migrations',
};
