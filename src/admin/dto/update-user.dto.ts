import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/users/entities/user.entity';

export class AdminUpdateUserDto {

    @ApiProperty()
    first_name?: string;

    @ApiProperty()
    last_name?: string;

    @ApiProperty()
    username?: string;

    @ApiProperty()
    email?: string;

    @ApiProperty({ enum: UserStatus, default: "Can be one of the following values: ACTIVE, BLOCKED" })
    @IsEnum(UserStatus)
    status?: UserStatus;

    @ApiProperty({ enum: UserRole, default: "Can be one of the following values: ADMIN, USER" })
    @IsEnum(UserRole)
    role?: UserRole;

}
