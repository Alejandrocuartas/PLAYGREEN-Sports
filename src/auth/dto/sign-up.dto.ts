import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'first_name must have atleast 3 characters.' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'last_name must have atleast 3 characters.' })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'username have atleast 3 characters.' })
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: 'Password must have atleast 5 characters.' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, default: "Can be one of the following values: ADMIN, USER" })
  @IsEnum(UserRole)
  role?: UserRole;
}
