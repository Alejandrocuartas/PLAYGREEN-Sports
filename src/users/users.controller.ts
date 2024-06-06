import {
  Controller,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import ErrorMessages from 'src/utilities/utilities.errors';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Request() req: CustomRequest,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      if (req?.user?.user_id != id) {
        throw new Error(ErrorMessages.CANNOT_UPDATE_THIS_USER);
      }

      const user = await this.usersService.updateUser(+id, updateUserDto);
      return user;

    } catch (error) {
      GetErrorResponse(error);
    }
  }
}
