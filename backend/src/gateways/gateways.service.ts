import { Inject, Injectable } from '@nestjs/common';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { Repository } from 'typeorm';
import { Gateway } from '../entities/gateway.entity';

@Injectable()
export class GatewaysService {
  constructor(
    @Inject('GATEWAY_REPO') private gatewayRepo: Repository<Gateway>,
  ) {}

  create(createGatewayDto: any) {
    return this.gatewayRepo.save(createGatewayDto);
  }

  findAll() {
    return this.gatewayRepo.find();
  }

  findOne(id: string) {
    return this.gatewayRepo.find({ where: { id } });
  }

  update(id: string, updateGatewayDto: UpdateGatewayDto) {
    return this.gatewayRepo.save({ ...updateGatewayDto, id });
  }

  remove(id: string) {
    return this.gatewayRepo.delete({ id: id });
  }
}
