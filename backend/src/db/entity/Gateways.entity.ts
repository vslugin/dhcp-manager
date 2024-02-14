
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn,UpdateDateColumn } from "typeorm"

@Entity()
export class Gateways extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column({
        unique: true
    })
    ip_addr: string

    @CreateDateColumn({ type: "datetime", default: () => "datetime('now')" })
    public created_at: Date;

    @UpdateDateColumn({ type: "datetime", default: () => "datetime('now')", onUpdate: "datetime('now')"})
    public updated_at: Date;
}
