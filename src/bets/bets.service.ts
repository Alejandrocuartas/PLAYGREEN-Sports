import { Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { Bet, BetStatus } from './entities/bet.entity';
import { BetOption, BetOptionResult } from './entities/bet-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ErrorMessages from 'src/utilities/utilities.errors';

@Injectable()
export class BetsService {

  constructor(
    @InjectRepository(Bet) private readonly betsRepository: Repository<Bet>,
  ) { }

  async create(createBetDto: CreateBetDto) {
    const containsDraw = createBetDto.options.some((option) => option?.name?.toLowerCase() === 'draw');
    if (!containsDraw && createBetDto?.options?.length === 3) {
      throw new Error(ErrorMessages.DRAW_OPTION_REQUIRED);
    }

    let bet = new Bet();
    bet.sport = createBetDto.sport;
    bet.event_id = createBetDto.event_id;

    const betOptions: BetOption[] = [];
    createBetDto.options.forEach((option) => {
      if (option.name) {
        const betOption = new BetOption();
        betOption.name = option.name;
        betOptions.push(betOption);
      }
    });

    if (betOptions.length === 0) {
      throw new Error(ErrorMessages.NO_OPTIONS_PROVIDED);
    }

    bet.options = betOptions;

    console.log(bet)

    bet = await this.betsRepository.save(bet);

    return bet;
  }

  async listBets(isAdmin: boolean) {
    if (isAdmin) {
      return this.betsRepository.find({
        relations: {
          options: true,
        },
      });
    }

    return this.betsRepository.find({
      where: {
        status: BetStatus.ACTIVE,
        deleted_at: null,
      },
      relations: {
        options: true,
      },
    });
  }

  async updateBet(id: number, updateBetDto: UpdateBetDto) {
    const bet = await this.betsRepository.findOne({ where: { id }, relations: { options: true } });
    if (!bet) {
      throw new Error(ErrorMessages.BET_NOT_FOUND);
    }

    if (updateBetDto.status === BetStatus.CANCELLED) {
      bet.status = BetStatus.CANCELLED;
      return this.betsRepository.save(bet);
    }

    if (updateBetDto.status !== BetStatus.SETTLED) {
      return bet;
    }


    if (!updateBetDto.winner_option_id) {
      throw new Error(ErrorMessages.INCORRECT_WINNER_OPTION_ID);
    }

    const existingBetOption = bet.options.find((option) => option.id === updateBetDto.winner_option_id);
    if (!existingBetOption) {
      throw new Error(ErrorMessages.INCORRECT_WINNER_OPTION_ID);
    }

    const updatedBetOptions = bet.options.map((option) => {
      if (option.id === updateBetDto.winner_option_id) {
        option.result = BetOptionResult.WON;
      } else {
        option.result = BetOptionResult.LOST;
      }
      return option;
    });

    bet.options = updatedBetOptions;
    bet.status = BetStatus.SETTLED;

    //TO-DO: Deposit money

    return this.betsRepository.save(bet);
  }

}
