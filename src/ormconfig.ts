import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const ENV = !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`;
const path = resolve(__dirname, `../${ENV}`);
const envConfig = dotenv.parse(readFileSync(path));

for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const typeOrmConfig: DataSourceOptions & {
  seeds: string[];
  factories: string[];
} = {
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: true,
  seeds: [__dirname + '/../**/*.seed{.ts,.js}'],
  factories: [__dirname + '/../**/*.factory{.ts,.js}'],
};

export default new DataSource(typeOrmConfig);
