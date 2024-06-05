import { config } from 'dotenv';
config();

import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException({ validation_errors: result });
      },
      stopAtFirstError: true,
    }),
  );

  app.enableCors({ origin: '*' });

  const portStr = process.env.PORT;
  let port = Number(portStr);
  if (!portStr || isNaN(port)) {
    port = 8080;
  }

  await app.listen(Number(port));
}
bootstrap();
