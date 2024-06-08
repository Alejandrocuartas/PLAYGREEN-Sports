import { ApiProperty } from "@nestjs/swagger";
import { BetState } from "src/bets/entities/user-bet.entity";
import { TransactionStatus, TransactionType } from "src/transactions/entities/transaction.entity";

export class AuthorizationResponse {
    @ApiProperty()
    access_token: string;
}

export class UserSession {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    iat: number;

    @ApiProperty()
    exp: number;
}

export class User {
    @ApiProperty()
    id: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    role: string;
}

export class Transaction {
    @ApiProperty()
    id: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    type: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    user_bet_id: number;

    @ApiProperty({ type: User })
    user: User;
}

export class AdminTransactionsResponse {
    @ApiProperty()
    total: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pages: number;

    @ApiProperty({ type: Transaction, isArray: true })
    transactions: Transaction[];
}

export class BalanceResponse {
    @ApiProperty()
    balance: number;
}

export class UserBetSwagger {
    @ApiProperty()
    id: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

    @ApiProperty()
    state: BetState;

    @ApiProperty()
    odd: number;
}

export class TransactionSwagger {
    @ApiProperty()
    id: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

    @ApiProperty({ type: User })
    user: User;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    type: TransactionType;

    @ApiProperty()
    status: TransactionStatus;

    @ApiProperty()
    user_bet_id?: number;
}


export class UserTransaction {
    @ApiProperty()
    id: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    type: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    user_bet_id: number;
}

export class UserTransactionsResponse {
    @ApiProperty()
    total: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pages: number;

    @ApiProperty({ type: UserTransaction, isArray: true })
    transactions: UserTransaction[];
}

/* 
{
    "validation_errors": [
        {
            "property": "bet_option_id",
            "message": "bet_option_id should not be empty"
        }
    ]
}
*/

export class ValidationError {
    @ApiProperty()
    property: string;

    @ApiProperty()
    message: string;
}
export class ValidationErrors {
    @ApiProperty({ type: ValidationError, isArray: true })
    validation_errors: ValidationError[];
}

export class OtherErrors {
    @ApiProperty()
    message: string;
}
