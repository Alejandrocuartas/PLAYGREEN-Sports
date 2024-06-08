import { Body, Controller, Param, Patch, UseGuards, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { TransactionType } from 'src/transactions/entities/transaction.entity';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AdminTransactionsResponse, BalanceResponse } from 'src/utilities/utilities.swagger-classes';

@UseGuards(AdminGuard)
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @ApiBearerAuth("Authorization")
    @ApiOperation({
        description: 'The endpoint allows the admin to update any non-admin user information and status. The admin is authenticated by the JWT token.',
        summary: 'Only admins can use this endpoint.',
    })
    @ApiOkResponse({
        description: 'User updated successfully',
        type: User,
    })
    @Patch('users/:id')
    async adminUpdateUser(
        @Body() updateUserDto: AdminUpdateUserDto,
        @Param('id') id: number,
    ) {
        try {
            const user = await this.adminService.adminUpdateUser(+id, updateUserDto);
            return user;
        } catch (error) {
            GetErrorResponse(error);
        }
    }

    @ApiBearerAuth("Authorization")
    @ApiOperation({
        description: 'The endpoint returns the list of all existing transactions paginated and filtered by user_id and type. The admin is authenticated by the JWT token.',
        summary: 'Only admins can use this endpoint.',
    })
    @ApiOkResponse({
        description: 'Transactions returned successfully',
        type: AdminTransactionsResponse,
    })
    @ApiQuery({
        name: 'limit',
        description: 'The number of transactions to be returned',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'page',
        description: 'The page number of transactions to be returned',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'type',
        description: 'The type of transactions to be returned',
        required: false,
        enum: TransactionType,
    })
    @ApiQuery({
        name: 'user_id',
        description: 'The user_id of transactions to be returned',
        required: false,
        type: Number,
    })
    @Get('transactions')
    async adminGetTransactions(
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
        @Query('type') type?: TransactionType,
        @Query('user_id') userId?: number,
    ) {
        try {
            let userIdParam = userId;
            if (userIdParam) {
                userIdParam = +userId;
            }
            const transactions = await this.adminService.adminGetTransactions(userIdParam, +limit, +page, type);
            return transactions;
        } catch (error) {
            GetErrorResponse(error);
        }
    }

    @ApiBearerAuth("Authorization")
    @ApiOperation({
        description: 'The endpoint returns the user balance. The admin is authenticated by the JWT token.',
        summary: 'Only admins can use this endpoint.',
    })
    @ApiOkResponse({
        description: 'Balance returned successfully',
        type: BalanceResponse,
    })
    @Get('users/:id/transactions/balance')
    async adminGetUserBalance(
        @Param('id') id: number,
    ) {
        try {
            const balance = await this.adminService.adminGetUserBalance(+id);
            return balance;
        } catch (error) {
            GetErrorResponse(error);
        }
    }
}
