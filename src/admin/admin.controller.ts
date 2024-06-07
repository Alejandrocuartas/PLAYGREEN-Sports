import { Body, Controller, Param, Patch, UseGuards, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { TransactionType } from 'src/transactions/entities/transaction.entity';

@UseGuards(AdminGuard)
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

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

    @Get('transactions')
    async adminGetTransactions(
        @Query('limit') limit?: number,
        @Query('page') page?: number,
        @Query('type') type?: TransactionType,
        @Query('user_id') userId?: number,
    ) {
        try {
            const transactions = await this.adminService.adminGetTransactions(+userId, +limit, +page, type);
            return transactions;
        } catch (error) {
            GetErrorResponse(error);
        }
    }
}
