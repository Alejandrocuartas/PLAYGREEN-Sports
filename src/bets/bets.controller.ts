import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { AdminGuard, AuthGuard } from 'src/auth/auth.guard';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { UserRole } from 'src/users/entities/user.entity';
import { UpdateBetDto } from './dto/update-bet.dto';
import CreateUserBetDto from './dto/create-user-bet.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Bet } from './entities/bet.entity';
import { UserBetSwagger } from 'src/utilities/utilities.swagger-classes';

@UseGuards(AuthGuard)
@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) { }

  @ApiOperation({
    description: 'The endpoint allows the admin to create a new bet. The admin is authenticated by the JWT token.',
    summary: 'Only admins can use this endpoint.',
  })
  @ApiCreatedResponse({
    description: 'Bet created successfully',
    type: Bet,
  })
  @ApiBearerAuth("Authorization")
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

  @ApiOperation({
    description: 'The endpoint returns all the bets. The user is authenticated by the JWT token. If user is not admin, the endpoint returns only the ACTIVE bets.',
  })
  @ApiOkResponse({
    description: 'Bets returned successfully',
    type: Bet,
  })
  @ApiQuery({
    name: 'sport',
    description: 'Filters the bets by sport. I.e. "soccer", "box", "MMA" or something like that.',
    required: false,
  })
  @ApiBearerAuth("Authorization")
  @Get()
  async listBets(
    @Request() req: CustomRequest,
    @Query('sport') sport?: string,
  ) {
    try {
      const bets = await this.betsService.listBets(req?.user?.role === UserRole.ADMIN, sport);
      return bets;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

  @ApiOperation({
    description: 'The endpoint allows an admin to update a bet. The admin is authenticated by the JWT token.',
    summary: 'Only admins can use this endpoint.',
  })
  @ApiOkResponse({
    description: 'Bet updated successfully',
    type: Bet,
  })
  @ApiBearerAuth("Authorization")
  @UseGuards(AdminGuard)
  @Patch(':id')
  async updateBet(
    @Body() updateBetDto: UpdateBetDto,
    @Param('id') id: number,
  ) {
    try {
      const bet = await this.betsService.updateBet(+id, updateBetDto);
      return bet;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

  @ApiOperation({
    description: 'The endpoint allows an user to create a user bet. The user is authenticated by the JWT token. Each time a user bet is created, the odds of the bet options are recalculated.',
  })
  @ApiCreatedResponse({
    description: 'User bet created successfully',
    type: UserBetSwagger,
  })
  @ApiBearerAuth("Authorization")
  @Post(':id/user-bets')
  async createUserBet(
    @Body() createUserBetDto: CreateUserBetDto,
    @Param('id') betId: number,
    @Request() req: CustomRequest,
  ) {

    try {
      const userBet = await this.betsService.createUserBet(+betId, +req?.user?.user_id, createUserBetDto);
      return userBet;
    } catch (error) {
      GetErrorResponse(error);
    }

  }

}
