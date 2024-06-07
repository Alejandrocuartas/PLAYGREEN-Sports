import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { AuthGuard } from 'src/auth/auth.guard';
import ErrorMessages from 'src/utilities/utilities.errors';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: CustomRequest,
  ) {
    try {
      const transaction = await this.transactionsService.create(createTransactionDto, req?.user?.user_id);
      return transaction;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('balance')
  async getTransactionsBalance(
    @Request() req: CustomRequest,
  ) {
    try {
      const balance = await this.transactionsService.getTransactionsBalance(req?.user?.user_id);
      return balance;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

}
