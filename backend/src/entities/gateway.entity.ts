import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gateway {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  ip_addr: string;
}
