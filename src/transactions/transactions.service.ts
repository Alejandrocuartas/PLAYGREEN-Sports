import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus, TransactionType } from './entities/transaction.entity';
import ErrorMessages from 'src/utilities/utilities.errors';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(createTransactionDto: CreateTransactionDto, userId: number, fromClient?: boolean) {

    if (fromClient) {
      if (![TransactionType.DEPOSIT, TransactionType.WITHDRAW].includes(createTransactionDto.type)) {
        throw new Error(ErrorMessages.INVALID_TRANSACTION_TYPE);
      }
      const balance = await this.getTransactionsBalance(userId);
      if (balance.balance < createTransactionDto.amount && createTransactionDto.type === TransactionType.WITHDRAW) {
        throw new Error(ErrorMessages.INSUFFICIENT_FUNDS_FOR_WITHDRAW);
      }
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    const transaction = new Transaction();
    const { password, ...userData } = user;
    transaction.user = userData;

    let amountController = 1;
    if (createTransactionDto.type === TransactionType.WITHDRAW || createTransactionDto.type === TransactionType.BET) {
      amountController = -1;
    }

    transaction.amount = createTransactionDto.amount * amountController;
    transaction.type = createTransactionDto.type;
    transaction.status = TransactionStatus.COMPLETED;

    if (createTransactionDto.user_bet_id) {
      transaction.user_bet_id = createTransactionDto.user_bet_id;
    }

    return this.transactionRepository.save(transaction);
  }

  async getTransactionsBalance(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    const transactions = await this.transactionRepository.find({
      where: {
        user: {
          id: userId,
        },
        status: TransactionStatus.COMPLETED,
        deleted_at: null,
      },
    });

    let balance = 0;
    transactions.forEach((transaction) => {
      console.log(transaction.amount, transaction.type);
      balance += Number(transaction.amount);
    });

    return { balance };
  }

  async getTransactions(userId: number, limit: number = 10, page: number = 1, type?: TransactionType) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    const whereClause: any = {
      user: {
        id: userId,
      },
      status: TransactionStatus.COMPLETED,
      deleted_at: null,
    };

    if (type) {
      whereClause.type = type;
    }

    const transactions = await this.transactionRepository.find({
      where: whereClause,
      order: {
        id: 'DESC',
      },
      take: limit,
      skip: limit * (page - 1),
    });

    const total = await this.transactionRepository.count({ where: whereClause });

    return {
      total: await this.transactionRepository.count({ where: whereClause }),
      limit,
      page,
      pages: Math.ceil(total / limit),
      transactions,
    };
  }

  async adminGetTransactions(userId?: number, limit: number = 10, page: number = 1, type?: TransactionType) {
    const whereClause: any = {
      deleted_at: null,
    };

    if (type) {
      whereClause.type = type;
    }

    if (userId) {
      whereClause.user = {
        id: userId,
      };
    }

    const transactions = await this.transactionRepository.find({
      where: whereClause,
      order: {
        id: 'DESC',
      },
      take: limit,
      skip: limit * (page - 1),
      relations: {
        user: true,
      },
    });

    const total = await this.transactionRepository.count({ where: whereClause });

    return {
      total: await this.transactionRepository.count({ where: whereClause }),
      limit,
      page,
      pages: Math.ceil(total / limit),
      transactions,
    };
  }

}

