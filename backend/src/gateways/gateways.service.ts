import { Injectable } from '@nestjs/common';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { Repository } from 'typeorm';
import { Gateway } from './entities/gateway.entity';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GatewaysService {
  constructor(
    @InjectRepository(Gateway) private gatewayRepo: Repository<Gateway>,
  ) {}

  create(createGatewayDto: CreateGatewayDto) {
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
    return this.gatewayRepo.delete({ id });
  }
}
