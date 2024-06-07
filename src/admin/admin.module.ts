import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Transaction]),
  ],
  controllers: [AdminController],
  providers: [AdminService, UsersService, TransactionsService],
})
export class AdminModule { }
