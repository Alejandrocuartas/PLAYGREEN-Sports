import { UserBet } from 'src/bets/entities/user-bet.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  @Column({ length: 25 })
  first_name: string;

  @ApiProperty()
  @Column({ length: 25 })
  last_name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'text' })
  password?: string;

  @ApiProperty()
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
