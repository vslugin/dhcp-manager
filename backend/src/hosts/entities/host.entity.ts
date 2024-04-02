import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Gateway } from '../../gateways/entities/gateway.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity()
export class Host {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  is_active: boolean;

  @Column()
  ip_addr: string;

  @Column()
  mac_addr: string;

  @ManyToOne(() => Gateway, (gateway) => gateway.id)
  gateway: Gateway;

  @ManyToOne(() => Room, (room) => room.id)
  room: Room;
}
