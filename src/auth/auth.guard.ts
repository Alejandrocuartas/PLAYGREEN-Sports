import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import ErrorMessages from 'src/utilities/utilities.errors';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request?.user) {
      throw new HttpException(
        {
          message:
            'Unexpected error: user is not defined. Please set the Authguard after AuthGuard.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (request?.user?.role !== UserRole.ADMIN) {
      throw new HttpException(
        { message: ErrorMessages.USER_NOT_ADMIN },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
