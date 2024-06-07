import {
    IsNotEmpty,
    IsNumber,
    Min
} from 'class-validator';

class CreateUserBetDto {
    @Min(1)
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @Min(1)
    @IsNumber()
    @IsNotEmpty()
    bet_option_id: number;
}

export default CreateUserBetDto;
