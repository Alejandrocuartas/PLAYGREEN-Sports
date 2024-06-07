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

  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    if (![TransactionType.DEPOSIT, TransactionType.WITHDRAW].includes(createTransactionDto.type)) {
      throw new Error(ErrorMessages.INVALID_TRANSACTION_TYPE);
    }

    const balance = await this.getTransactionsBalance(userId);
    if (balance.balance < createTransactionDto.amount && createTransactionDto.type === TransactionType.WITHDRAW) {
      throw new Error(ErrorMessages.INSUFFICIENT_FUNDS_FOR_WITHDRAW);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    const transaction = new Transaction();
    const { password, ...userData } = user;
    transaction.user = userData;

    let amountController = 1;
    if (createTransactionDto.type === TransactionType.WITHDRAW) {
      amountController = -1;
    }

    transaction.amount = createTransactionDto.amount * amountController;
    transaction.type = createTransactionDto.type;
    transaction.status = TransactionStatus.COMPLETED;

    return this.transactionRepository.save(transaction);
  }

  async getTransactionsBalance(user_id: number) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    const transactions = await this.transactionRepository.find({
      where: {
        user: {
          id: user_id,
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

}
