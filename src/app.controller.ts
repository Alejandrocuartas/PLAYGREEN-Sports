import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBadRequestResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OtherErrors, ValidationErrors } from './utilities/utilities.swagger-classes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({
    description: 'Common error Responses for all the endpoints of the API',
    summary: 'Common error Responses for all the endpoints of the API',
  })
  @ApiBadRequestResponse({
    description: 'The Dtos throw errors when the request payloads are not valid. For this type of errors, the status code is always 400.',
    type: ValidationErrors,
  })
  @ApiUnauthorizedResponse({
    description: 'For authorization, not found, or any other error that is not a validation error, the status code is variable according to the error, but the response payload is always the same.',
    type: OtherErrors,
  })
  @Get()
  getHello() {
    return 'Hello World!';
  }
}
