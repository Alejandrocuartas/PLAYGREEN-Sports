import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bet } from './bet.entity';

export enum BetState {
    OPEN = 'OPEN',
    WON = 'WON',
    LOST = 'LOST',
}

@Entity()
export class UserBet {
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

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    amount: number;

    @Column({ type: 'enum', enum: BetState, default: BetState.OPEN })
    state: BetState;

    @ManyToOne(() => User, (user) => user.userBets)
    user: User;

    @ManyToOne(() => Bet, (bet) => bet.userBets)
    bet: Bet;
}
