import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnv } from './app.environment';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BetsModule } from './bets/bets.module';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: getEnv('DB_HOST'),
      port: Number(getEnv('DB_PORT')),
      password: getEnv('DB_PASSWORD'),
      username: getEnv('DB_USERNAME'),
      database: getEnv('DB_NAME'),
      entities: [
        __dirname + '/users/entities/*.entity{.ts,.js}',
        __dirname + '/bets/entities/*.entity{.ts,.js}',
        __dirname + '/transactions/entities/*.entity{.ts,.js}',
      ],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    BetsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
