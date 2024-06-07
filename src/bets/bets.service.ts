import { Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { Bet, BetStatus } from './entities/bet.entity';
import { BetOption, BetOptionResult } from './entities/bet-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ErrorMessages from 'src/utilities/utilities.errors';
import { BetState, UserBet } from './entities/user-bet.entity';
import { User } from 'src/users/entities/user.entity';
import CreateUserBetDto from './dto/create-user-bet.dto';
import { Transaction, TransactionType } from 'src/transactions/entities/transaction.entity';
import { UsersService } from 'src/users/users.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class BetsService {

  constructor(
    @InjectRepository(Bet) private readonly betsRepository: Repository<Bet>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(UserBet) private readonly userBetsRepository: Repository<UserBet>,
    @InjectRepository(BetOption) private readonly betOptionsRepository: Repository<BetOption>,
    private transactionsService: TransactionsService,
  ) { }

  async create(createBetDto: CreateBetDto) {
    const containsDraw = createBetDto.options.some((option) => option?.name?.toLowerCase() === 'draw');
    if (!containsDraw && createBetDto?.options?.length === 3) {
      throw new Error(ErrorMessages.DRAW_OPTION_REQUIRED);
    }

    let bet = new Bet();
    bet.sport = createBetDto.sport.toUpperCase();
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

  async listBets(isAdmin: boolean, sport?: string) {

    let whereClause: any = {};
    if (sport) {
      whereClause = { sport };
    }

    if (isAdmin) {
      return this.betsRepository.find({
        where: whereClause,
        relations: {
          options: true,
        },
      });
    }

    return this.betsRepository.find({
      where: {
        status: BetStatus.ACTIVE,
        deleted_at: null,
        ...whereClause,
      },
      relations: {
        options: true,
      },
    });
  }

  async updateBet(id: number, updateBetDto: UpdateBetDto) {
    const bet = await this.betsRepository.findOne({ where: { id }, relations: { options: { userBets: { user: true } } } });
    if (!bet) {
      throw new Error(ErrorMessages.BET_NOT_FOUND);
    }

    if (updateBetDto.status === BetStatus.CANCELLED && bet.status === BetStatus.SETTLED) {
      throw new Error(ErrorMessages.BET_ALREADY_SETTLED);
    }

    if (updateBetDto.status !== BetStatus.SETTLED) {
      bet.status = updateBetDto.status;
      return this.betsRepository.save(bet);
    }

    if (!updateBetDto.winner_option_id) {
      throw new Error(ErrorMessages.INCORRECT_WINNER_OPTION_ID);
    }

    const existingBetOption = bet.options.find((option) => option.id === updateBetDto.winner_option_id);
    if (!existingBetOption) {
      throw new Error(ErrorMessages.INCORRECT_WINNER_OPTION_ID);
    }

    const winnerUserBets: UserBet[] = [];
    const loserUserBets: UserBet[] = [];
    const updatedBetOptions = bet.options.map((option) => {
      if (option.id === updateBetDto.winner_option_id) {
        option.result = BetOptionResult.WON;
        winnerUserBets.push(...option.userBets);
      } else {
        option.result = BetOptionResult.LOST;
        loserUserBets.push(...option.userBets);
      }
      return option;
    });

    bet.options = updatedBetOptions;
    bet.status = BetStatus.SETTLED;

    if (winnerUserBets.length > 0) {
      for (const userBet of winnerUserBets) {
        const amount = Number(userBet.amount) * Number(userBet.odd);
        await Promise.all([
          this.transactionsService.create(
            { type: TransactionType.WIN, amount, user_bet_id: userBet.id },
            userBet.user.id,
          ),
          this.userBetsRepository.update(userBet.id, { state: BetState.WON }),
        ]);
      }
    }

    if (loserUserBets.length > 0) {
      for (const userBet of loserUserBets) {
        this.userBetsRepository.update(userBet.id, { state: BetState.LOST })
      }
    }

    return this.betsRepository.save(bet);
  }

  async createUserBet(betId: number, userId: number, createUserBetDto: CreateUserBetDto) {

    const userBalance = await this.transactionsService.getTransactionsBalance(userId);
    if (userBalance.balance < createUserBetDto.amount) {
      throw new Error(ErrorMessages.INSUFFICIENT_FUNDS_FOR_BET);
    }

    const betOptions = await this.betOptionsRepository.find({ where: { bet: { id: betId } }, relations: { bet: true } });

    let targetBetOption = betOptions.find((option) => option.id === createUserBetDto.bet_option_id);
    if (!targetBetOption) {
      throw new Error(ErrorMessages.BET_OPTION_NOT_FOUND);
    }

    if (targetBetOption.bet.status !== BetStatus.ACTIVE) {
      throw new Error(ErrorMessages.BET_NOT_ACTIVE);
    }

    let userBet = new UserBet();
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    const { password, ...userData } = user;
    userBet.user = userData;
    userBet.bet = targetBetOption.bet;
    userBet.amount = createUserBetDto.amount;
    userBet.odd = targetBetOption.odd;
    userBet.betOption = targetBetOption;

    userBet = await this.userBetsRepository.save(userBet);

    await Promise.all([
      this.transactionsService.create(
        { type: TransactionType.BET, amount: createUserBetDto.amount, user_bet_id: userBet.id },
        userId,
      ),
      this.recalculateBetOptionsOdds(betId),
    ]);

    targetBetOption = await this.betOptionsRepository.findOne({ where: { id: targetBetOption.id } });

    userBet.odd = targetBetOption.odd;

    await this.userBetsRepository.save(userBet);

    return userBet;
  }

  async recalculateBetOptionsOdds(betId: number) {
    const userBets = await this.userBetsRepository.find({ where: { bet: { id: betId } }, relations: { betOption: true } });

    const optionAmounts = new Map<number, number>();
    let totalAmount = 0;
    for (const userBet of userBets) {
      const optionId = userBet.betOption.id;
      const betAmount = userBet.amount;

      if (!optionAmounts.has(optionId)) {
        optionAmounts.set(optionId, 0);
      }

      optionAmounts.set(optionId, Number(Number(optionAmounts.get(optionId)) + Number(betAmount)));
      totalAmount += Number(betAmount);
    }

    for (const [optionId, optionTotal] of optionAmounts) {
      let odd: number = 0;

      if (totalAmount === 0) {
        odd = 1;
      } else {
        odd = 2 - (optionTotal / totalAmount);
      }

      await this.betOptionsRepository.update(optionId, { odd });
    }
  }
}
