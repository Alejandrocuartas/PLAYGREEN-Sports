import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsEnum,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class signUpDto {

    @IsString()
    @MinLength(3, { message: 'first_name must have atleast 3 characters.' })
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @MinLength(3, { message: 'last_name must have atleast 3 characters.' })
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @MinLength(3, { message: 'username have atleast 3 characters.' })
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(5, { message: 'Password must have atleast 5 characters.' })
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    role?: UserRole;

}
