import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import ErrorMessages from 'src/utilities/utilities.errors';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(user: User) {
    user = await this.userRepository.save(user);
    return user;
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    if (updateUserDto.first_name) {
      user.first_name = updateUserDto.first_name;
    }
    if (updateUserDto.last_name) {
      user.last_name = updateUserDto.last_name;
    }
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    await this.userRepository.save(user);

    const { password, ...userData } = user;
    return userData;
  }

  async update(user: User) {
    const userData = await this.userRepository.save(user);
    return userData;
  }

}
