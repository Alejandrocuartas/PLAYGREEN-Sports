import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionType } from './entities/transaction.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BalanceResponse, TransactionSwagger, UserTransactionsResponse } from 'src/utilities/utilities.swagger-classes';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) { }

  @ApiOperation({
    description: 'The endpoint allows the user to create a new transaction. The user is authenticated by the JWT token.',
  })
  @ApiCreatedResponse({
    description: 'Transaction created successfully',
    type: TransactionSwagger,
  })
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: CustomRequest,
  ) {
    try {
      const transaction = await this.transactionsService.create(createTransactionDto, req?.user?.user_id, true);
      return transaction;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

  @ApiOperation({
    description: 'The endpoint allows the user to get its balance. The user is authenticated by the JWT token.',
  })
  @ApiOkResponse({
    description: 'Balance returned successfully',
    type: BalanceResponse,
  })
  @ApiBearerAuth("Authorization")
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

  @ApiOperation({
    description: 'The endpoint allows the user to get its transactions. The user is authenticated by the JWT token.',
  })
  @ApiOkResponse({
    description: 'Transactions returned successfully',
    type: UserTransactionsResponse,
  })
  @ApiBearerAuth("Authorization")
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'type',
    description: 'Filters the transactions by type.',
    required: false,
    enum: TransactionType,
  })
  @UseGuards(AuthGuard)
  @Get()
  async getTransactions(
    @Request() req: CustomRequest,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('type') type?: TransactionType,
  ) {

    if (!limit) {
      limit = 10;
    }

    if (!page) {
      page = 1;
    }

    try {
      const transactions = await this.transactionsService.getTransactions(+req?.user?.user_id, +limit, +page, type);
      return transactions;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

}
