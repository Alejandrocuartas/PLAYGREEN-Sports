import { IsEnum, IsNotEmpty } from "class-validator";
import { BetStatus } from "../entities/bet.entity";

export class UpdateBetDto {
    @IsNotEmpty()
    @IsEnum(BetStatus)
    status?: BetStatus;

    winner_option_id?: number;
}
