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
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({
    description: 'Endpoint for the users to update their own information. The user is authenticated by the JWT token.',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: User,
  })
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  @Patch()
  async updateUser(
    @Request() req: CustomRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.updateUser(+req?.user?.user_id, updateUserDto);
      return user;

    } catch (error) {
      GetErrorResponse(error);
    }
  }
}
