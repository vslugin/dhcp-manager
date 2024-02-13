import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { safeJsonParse } from '../utils/common';

config();

const configService = new ConfigService();

const loggingSQL = !!safeJsonParse(configService.get('LOGGING_SQL'));
export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: configService.get('DB_FILE', 'testdb.db'),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/**/*.{js,ts}'],
  migrationsTableName: 'migrations_typeorm',
  logging: loggingSQL ? ['error', 'query'] : false,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
export default new DataSource(dataSourceOptions);
