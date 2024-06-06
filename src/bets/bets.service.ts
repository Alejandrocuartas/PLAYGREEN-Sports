import { Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { Bet, BetStatus } from './entities/bet.entity';
import { BetOption } from './entities/bet-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BetsService {

  constructor(
    @InjectRepository(Bet) private readonly betsRepository: Repository<Bet>,
  ) { }

  async create(createBetDto: CreateBetDto) {
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
      throw new Error('No options were provided');
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
}
