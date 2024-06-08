import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Bet } from "./bet.entity";
import { UserBet } from "./user-bet.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum BetOptionResult {
    WON = 'WON',
    LOST = 'LOST',
}

@Entity()
export class BetOption {

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
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    odd: number;

    @ApiProperty()
    @Column({ type: 'varchar', length: 25 })
    name: string;

    @ApiProperty({ enum: BetOptionResult, default: BetOptionResult.WON })
    @Column({ type: 'enum', enum: BetOptionResult, nullable: true })
    result: BetOptionResult;

    @ManyToOne(() => Bet, (bet) => bet.options)
    bet: Bet;

    @OneToMany(() => UserBet, (userBet) => userBet.betOption)
    userBets: UserBet[];

}