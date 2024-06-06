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

export class CreateBetOptionDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateBetDto {
    @IsString()
    @IsNotEmpty()
    sport: string;

    @IsEnum(BetEventId)
    @IsNotEmpty()
    event_id: BetEventId;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    //@Type(() => CreateBetOptionDto)
    @ValidateNested()
    options: CreateBetOptionDto[];
}