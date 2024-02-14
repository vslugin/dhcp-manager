import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { dataSourceOptions } from './db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostsController } from './controllers/hosts.controller';
import { GateController } from './controllers/gateways.controller';

config()

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.${process.env.NODE_ENV}.env`],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'dev', 'test', 'production')
          .default('dev'),
      }),
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController, HostsController, GateController],
  providers: [AppService],
})
export class AppModule {}
