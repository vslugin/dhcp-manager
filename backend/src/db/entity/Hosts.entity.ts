
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn,UpdateDateColumn } from "typeorm"

@Entity()
export class Hosts extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    is_active: boolean

    @Column({
        unique: true
    })
    ip_addr: string

    @Column({
        unique: true
    })
    mac_addr: string

    @Column()
    gate_id: string

    @Column()
    room_id: string
    @CreateDateColumn({ type: "datetime", default: () => "datetime('now')" })
    public created_at: Date;

    @UpdateDateColumn({ type: "datetime", default: () => "datetime('now')", onUpdate: "datetime('now')"})
    public updated_at: Date;
}
