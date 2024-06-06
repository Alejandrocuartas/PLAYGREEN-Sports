import {
    IsEnum,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/users/entities/user.entity';

export class AdminUpdateUserDto {

    first_name?: string;

    last_name?: string;

    username?: string;

    email?: string;

    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsEnum(UserRole)
    role?: UserRole;

}
