import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import ErrorMessages from 'src/utilities/utilities.errors';
import { UserRole } from 'src/users/entities/user.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionStatus, TransactionType } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class AdminService {
    constructor(
        private usersService: UsersService,
        private transactionsService: TransactionsService,
    ) { }

    async adminUpdateUser(id: number, updateUserDto: AdminUpdateUserDto) {
        const user = await this.usersService.findOneById(id);
        if (!user) {
            throw new Error(ErrorMessages.USER_NOT_FOUND);
        }

        if (user.role === UserRole.ADMIN) {
            throw new Error(ErrorMessages.CANNOT_UPDATE_ADMIN);
        }

        if (updateUserDto.first_name) {
            user.first_name = updateUserDto.first_name;
        }
        if (updateUserDto.last_name) {
            user.last_name = updateUserDto.last_name;
        }
        if (updateUserDto.username) {
            user.username = updateUserDto.username;
        }
        if (updateUserDto.status) {
            user.status = updateUserDto.status;
        }
        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }
        if (updateUserDto.role) {
            user.role = updateUserDto.role;
        }

        await this.usersService.update(user);

        const { password, ...userData } = user;
        return userData;
    }

    async adminGetTransactions(userId?: number, limit: number = 10, page: number = 1, type?: TransactionType) {
        const transactions = await this.transactionsService.adminGetTransactions(userId, limit, page, type);
        return transactions;
    }

    async adminGetUserBalance(userId: number) {
        const balance = await this.transactionsService.getTransactionsBalance(userId);
        return balance;
    }

}
