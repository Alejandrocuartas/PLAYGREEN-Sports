import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BetOption } from "./bet-option.entity";
import { UserBet } from "./user-bet.entity";
import { ApiProperty } from "@nestjs/swagger";

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

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty()
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @ApiProperty()
    @Column({ type: 'enum', enum: BetStatus, default: BetStatus.ACTIVE })
    status: BetStatus;

    @ApiProperty()
    @Column({ type: 'varchar', length: 25 })
    sport: string;

    @ApiProperty()
    @Column({ type: 'enum', enum: BetEventId })
    event_id: BetEventId;

    @ApiProperty({ type: BetOption, isArray: true })
    @OneToMany(() => BetOption, (betOption) => betOption.bet, { cascade: true })
    options: BetOption[];

    @OneToMany(() => UserBet, (userBet) => userBet.bet, { cascade: true })
    userBets: UserBet[];

}
