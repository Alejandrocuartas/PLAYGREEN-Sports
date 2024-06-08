import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    Min
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {

    @ApiProperty()
    @Min(1)
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ enum: TransactionType, default: "type must be one of the following values: DEPOSIT, WITHDRAW" })
    @IsEnum(TransactionType, { message: 'type must be one of the following values: DEPOSIT, WITHDRAW' })
    @IsNotEmpty()
    type: TransactionType;

    user_bet_id?: number;

}
