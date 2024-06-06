import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { UserRole } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) { }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createBetDto: CreateBetDto) {
    try {
      const bet = await this.betsService.create(createBetDto);
      return bet;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

  @Get()
  async listBets(@Request() req: CustomRequest) {
    try {
      const bets = await this.betsService.listBets(req?.user?.role === UserRole.ADMIN);
      return bets;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

}
