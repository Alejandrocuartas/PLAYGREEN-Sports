import { IsEnum, IsNotEmpty } from "class-validator";
import { BetStatus } from "../entities/bet.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBetDto {
    @ApiProperty({ enum: BetStatus, default: "Can be one of the following values: ACTIVE, CANCELLED, SETTLED. When the bet is SETTLED the winner_option_id is required. If you want to cancel or reactivate the bet, winner_option_id field is not required." })
    @IsNotEmpty()
    @IsEnum(BetStatus)
    status?: BetStatus;

    @ApiProperty({ required: false })
    winner_option_id?: number;
}
