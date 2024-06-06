import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Bet } from "./bet.entity";

enum BetOptionResult {
    WON = 'WON',
    LOST = 'LOST',
}

@Entity()
export class BetOption {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    odd: number;

    @Column({ type: 'varchar', length: 25 })
    name: string;

    @Column({ type: 'enum', enum: BetOptionResult, nullable: true })
    result: BetOptionResult;

    @ManyToOne(() => Bet, (bet) => bet.options)
    bet: Bet;

}