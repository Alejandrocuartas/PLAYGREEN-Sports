import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';
import { BetOption } from './entities/bet-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet, BetOption]),
  ],
  controllers: [BetsController],
  providers: [BetsService],
})
export class BetsModule { }
