import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gateway } from './entities/gateway.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Gateway])],
  controllers: [GatewaysController],
  providers: [GatewaysService],
})
export class GatewaysModule {}
