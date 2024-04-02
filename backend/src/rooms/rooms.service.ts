import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private roomRepo: Repository<Room>) {}
  create(createRoomDto: CreateRoomDto) {
    return this.roomRepo.save(createRoomDto);
  }

  findAll() {
    return this.roomRepo.find();
  }

  findOne(id: string) {
    return this.roomRepo.find({ where: { id } });
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.roomRepo.save({ ...updateRoomDto, id });
  }

  remove(id: string) {
    return this.roomRepo.delete({ id });
  }
}
