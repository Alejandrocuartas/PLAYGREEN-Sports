import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { AuthGuard, AdminGuard } from './auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiOkResponse, ApiOperation, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthorizationResponse, UserSession } from 'src/utilities/utilities.swagger-classes';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({
    description: 'The endpoint returns the access token for the user. The user is authenticated by the JWT token.',
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: AuthorizationResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const user = await this.authService.signIn(signInDto);
      return user;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

  @ApiOperation({
    description: 'The endpoint creates a new user. The user is authenticated by the JWT token.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: AuthorizationResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const user = await this.authService.signUp(signUpDto);
      return user;
    } catch (error) {
      GetErrorResponse(error);
    }
  }

  @ApiBearerAuth("Authorization")
  @ApiOperation({
    description: 'The endpoint returns the info of the user. The user is authenticated by the JWT token.',
  })
  @ApiOkResponse({
    description: 'User info returned successfully',
    type: UserSession,
  })
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: CustomRequest) {
    return req.user;
  }
}
