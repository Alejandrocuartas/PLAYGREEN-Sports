import { UserBet } from 'src/bets/entities/user-bet.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

@Entity()
export class User {
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

  @Column({ length: 25 })
  first_name: string;

  @Column({ length: 25 })
  last_name: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'text' })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Transaction, (transaction) => transaction.user, { cascade: true })
  transactions: Transaction[];

  @OneToMany(() => UserBet, (userBet) => userBet.user, { cascade: true })
  userBets: UserBet[];

}
