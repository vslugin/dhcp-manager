import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { databaseProviders } from '../db/database.providers';
import { repoProviders } from "../db/repo.providers";

@Module({
  controllers: [GatewaysController],
  providers: [GatewaysService, ...repoProviders, ...databaseProviders ],
})
export class GatewaysModule {}
