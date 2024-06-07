import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';
import { BetOption } from './entities/bet-option.entity';
import { UserBet } from './entities/user-bet.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet, BetOption, UserBet, User, Transaction]),
  ],
  controllers: [BetsController],
  providers: [BetsService, UsersService, TransactionsService],
})
export class BetsModule { }
