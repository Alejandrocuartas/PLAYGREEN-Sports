import { HttpException, HttpStatus } from '@nestjs/common';
import ErrorMessages from './utilities.errors';

const GetErrorResponse = (error: any) => {
  console.log(error);

  switch (error.message) {
    case ErrorMessages.USER_NOT_FOUND:
      throw new HttpException(
        { message: ErrorMessages.USER_NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    case ErrorMessages.USERNAME_ALREADY_EXISTS:
      throw new HttpException(
        { message: ErrorMessages.USERNAME_ALREADY_EXISTS },
        HttpStatus.CONFLICT,
      );
    case ErrorMessages.INVALID_PASSWORD:
      throw new HttpException(
        { message: ErrorMessages.INVALID_PASSWORD },
        HttpStatus.UNAUTHORIZED,
      );
    case ErrorMessages.USER_IS_BLOCKED:
      throw new HttpException(
        { message: ErrorMessages.USER_IS_BLOCKED },
        HttpStatus.UNAUTHORIZED,
      );
    case ErrorMessages.USER_NOT_ADMIN:
      throw new HttpException(
        { message: ErrorMessages.USER_NOT_ADMIN },
        HttpStatus.UNAUTHORIZED,
      );
    case ErrorMessages.CANNOT_UPDATE_THIS_USER:
      throw new HttpException(
        { message: ErrorMessages.CANNOT_UPDATE_THIS_USER },
        HttpStatus.UNAUTHORIZED,
      );
    case ErrorMessages.CANNOT_UPDATE_ADMIN:
      throw new HttpException(
        { message: ErrorMessages.CANNOT_UPDATE_ADMIN },
        HttpStatus.UNAUTHORIZED,
      );
    default:
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
};

export default GetErrorResponse;
