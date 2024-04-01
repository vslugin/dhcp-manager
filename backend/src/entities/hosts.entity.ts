import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Gateway } from './gateway.entity';
import { Room } from './rooms.entity';

@Entity()
export class Host {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  is_active: boolean;

  @Column()
  ip_addr: string;

  @Column()
  mac_addr: string;

  @ManyToOne(() => Gateway, (gateway) => gateway.id, { onDelete: 'SET NULL' })
  gateway: Gateway;

  @ManyToOne(() => Room, (room) => room.id, { onDelete: 'SET NULL' })
  room: Room;
}
