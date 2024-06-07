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
    case ErrorMessages.BET_NOT_FOUND:
      throw new HttpException(
        { message: ErrorMessages.BET_NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    case ErrorMessages.DRAW_OPTION_REQUIRED:
      throw new HttpException(
        { message: ErrorMessages.DRAW_OPTION_REQUIRED },
        HttpStatus.BAD_REQUEST,
      );
    case ErrorMessages.NO_OPTIONS_PROVIDED:
      throw new HttpException(
        { message: ErrorMessages.NO_OPTIONS_PROVIDED },
        HttpStatus.BAD_REQUEST,
      );
    case ErrorMessages.INCORRECT_WINNER_OPTION_ID:
      throw new HttpException(
        { message: ErrorMessages.INCORRECT_WINNER_OPTION_ID },
        HttpStatus.NOT_FOUND,
      );
    case ErrorMessages.INVALID_TRANSACTION_TYPE:
      throw new HttpException(
        { message: ErrorMessages.INVALID_TRANSACTION_TYPE },
        HttpStatus.BAD_REQUEST,
      );
    case ErrorMessages.INSUFFICIENT_FUNDS_FOR_WITHDRAW:
      throw new HttpException(
        { message: ErrorMessages.INSUFFICIENT_FUNDS_FOR_WITHDRAW },
        HttpStatus.BAD_REQUEST,
      );
    default:
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
};

export default GetErrorResponse;
