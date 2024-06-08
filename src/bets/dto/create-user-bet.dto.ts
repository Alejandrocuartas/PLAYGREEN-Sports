import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    Min
} from 'class-validator';

class CreateUserBetDto {
    @ApiProperty()
    @Min(1)
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @Min(1)
    @IsNumber()
    @IsNotEmpty()
    bet_option_id: number;
}

export default CreateUserBetDto;
