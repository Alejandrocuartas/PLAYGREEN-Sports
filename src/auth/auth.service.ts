import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import ErrorMessages from 'src/utilities/utilities.errors';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/sign-up.dto';
import { User, UserStatus } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(signInDto.username);
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new Error(ErrorMessages.USER_IS_BLOCKED);
    }

    const isValid = await bcrypt.compare(signInDto.password, user.password);
    if (!isValid) {
      throw new Error(ErrorMessages.INVALID_PASSWORD);
    }

    const payload = {
      user_id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signInDto: SignUpDto) {
    let user = await this.usersService.findOne(signInDto.username);
    if (user) {
      throw new Error(ErrorMessages.USERNAME_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(signInDto.password, 10);

    user = new User();
    user.first_name = signInDto.first_name;
    user.last_name = signInDto.last_name;
    user.username = signInDto.username;
    user.password = hashedPassword;
    user.role = signInDto.role;
    user = await this.usersService.create(user);

    const payload = {
      user_id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
