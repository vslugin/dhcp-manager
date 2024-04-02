import { Injectable } from '@nestjs/common';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { Repository } from 'typeorm';
import { Host } from './entities/host.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HostsService {
  constructor(@InjectRepository(Host) private hostRepo: Repository<Host>) {}
  create(createHostDto: CreateHostDto) {
    return this.hostRepo.save(createHostDto);
  }

  findAll() {
    return this.hostRepo.find();
  }

  findOne(id: string) {
    return this.hostRepo.find({ where: { id } });
  }

  update(id: string, updateHostDto: UpdateHostDto) {
    return this.hostRepo.save({ ...updateHostDto, id });
  }

  remove(id: string) {
    return this.hostRepo.delete({ id });
  }
}
