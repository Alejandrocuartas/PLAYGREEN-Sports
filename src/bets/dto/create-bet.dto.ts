import {
    IsEnum,
    IsNotEmpty,
    IsString,
    ValidateNested,
    ArrayMinSize,
    IsArray,
    ArrayMaxSize
} from 'class-validator';
import { BetEventId } from '../entities/bet.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBetOptionDto {
    @ApiProperty({ default: "The name of the option. I.e. 'draw', 'Real Madrid', 'Brasil'. There can be minimum 2 options and maximum 3 options if you include the draw option." })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateBetDto {
    @ApiProperty({ default: "Since event_id can be only MATCH or FIGHT, I highly recommend set sport to SOCCER, BOX, MMA or something like that." })
    @IsString()
    @IsNotEmpty()
    sport: string;

    @ApiProperty({ enum: BetEventId, default: "event_id can be only MATCH or FIGHT" })
    @IsEnum(BetEventId)
    @IsNotEmpty()
    event_id: BetEventId;

    @ApiProperty({ type: CreateBetOptionDto, isArray: true })
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    //@Type(() => CreateBetOptionDto)
    @ValidateNested()
    options: CreateBetOptionDto[];
}