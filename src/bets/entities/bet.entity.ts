import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BetOption } from "./bet-option.entity";

export enum BetStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    SETTLED = 'SETTLED',
}

export enum BetEventId {
    MATCH = 'MATCH',
    FIGHT = 'FIGHT',
}

@Entity()
export class Bet {

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

    @Column({ type: 'enum', enum: BetStatus, default: BetStatus.ACTIVE })
    status: BetStatus;

    @Column({ type: 'varchar', length: 25 })
    sport: string;

    @Column({ type: 'enum', enum: BetEventId })
    event_id: BetEventId;

    @OneToMany(() => BetOption, (betOption) => betOption.bet, { cascade: true })
    options: BetOption[];

}
