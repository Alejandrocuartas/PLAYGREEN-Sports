import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    Min
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

//amount must be greater than 0
export class CreateTransactionDto {

    @Min(1)
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsEnum(TransactionType, { message: 'type must be one of the following values: DEPOSIT, WITHDRAW' })
    @IsNotEmpty()
    type: TransactionType;

}
