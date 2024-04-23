import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { GatewaysModule } from './gateways/gateways.module';
import { RoomsModule } from './rooms/rooms.module';
import { HostsModule } from './hosts/hosts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { config } from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
config();
const configService = new ConfigService();

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
      type: 'sqlite',
      database: configService.get('DB_FILE', 'database.sqlite'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    GatewaysModule,
    RoomsModule,
    HostsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
  /*providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // <<--- // enable auth globally
    },
  ],*/
})
export class AppModule {}
