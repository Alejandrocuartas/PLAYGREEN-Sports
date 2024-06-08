# For Local Usage

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# PLAYGREEN Sports API Documentation

This document describes the flow to use the Bets Platform API. The API is built using the following technologies:

- **NestJS**
- **TypeScript**
- **JWT (JSON Web Tokens)**.
- **CI/CD with Github Actions**
- **AWS RDS**: The MySQL database is running on RDS.
- **AWS EC2**: The server is running on a EC2 instance.
- **AWS API Gateway & AWS Lambda**: To create a secure proxy for the API endpoints.

**Base URL of the API**: `https://p4dzgo7i4h.execute-api.us-east-1.amazonaws.com/default`

**Swagger Documentation**: [here](http://ec2-34-229-16-6.compute-1.amazonaws.com:8080/api) you can try the API with the Swagger UI.

## Endpoints and Usage Flow

### Authentication

1. **Register a New User**
   - **POST /auth/signup**: Allows any person to register with their info and returns a JWT.
     - **Recommendation**: Try with existing usernames to see validations.

2. **Log In**
   - **POST /auth/login**: Allows any person to log in with a username and password and returns a JWT.
     - **Recommendation**: Try with nonexistent usernames and incorrect passwords to see validations.

3. **Get Profile**
   - **GET /auth/profile**: Allows each authenticated user to get their basic info.
     - **Recommendation**: Use it without the JWT to see the unauthorized error.

### User Profile

4. **Update Profile**
   - **PATCH /users**: Allows each authenticated user to update their basic info.
     - **Recommendation**: Update password, username, and try to log in again.

### Admin Operations on Users

5. **Update User Info**
   - **PATCH /admin/users/{user_id}**: Allows admins to update any non-admin user info, excluding the password.
     - **Recommendation**: Change the role to see how the other user can access admin endpoints, and change the status to BLOCKED to see how that user is not allowed to log in anymore.

### Admin Operations on Transactions

6. **List Transactions**
   - **GET /admin/transactions**: Allows admins to list every non-deleted transaction.
     - **Recommendation**: Use pagination and filters with query params.

7. **Get User Balance**
   - **GET /admin/users/{id}/transactions/balance**: Allows admins to get the balance of any user.

### User Transactions

8. **Create Transaction**
   - **POST /transactions**: Allows each authenticated user to create a new transaction.
     - **Recommendation**: Try a DEPOSIT with amount 100, then a WITHDRAW with an amount greater than the balance to see the validation error.

9. **List Transactions**
   - **GET /transactions**: Allows each authenticated user to list transactions.
     - **Recommendation**: Use pagination and filters like type=WIN with query params.

10. **Get User Balance**
    - **GET /transactions/balance**: Allows each authenticated user to get their balance.
      - **Recommendation**: Use it without the JWT to see the unauthorized error.

### Bets Management

11. **Create Bet**
    - **POST /bets**: Allows admins to create a new bet.
      - **Recommendation**: Try a bet with 3 options and a draw option (e.g., sport: SOCCER, event_id: MATCH, option 1: Real Madrid, option 2: Barcelona, option 3: draw). If you send 3 options, one of them has to be a draw. The minimum number of options is 2.

12. **List Bets**
    - **GET /bets**: Allows each authenticated user to list bets.
      - **Recommendation**: Filter by sport. Non-admin users can only see ACTIVE bets.

13. **Update Bet**
    - **PATCH /bets/{id}**: Allows admins to update any bet.
      - **Recommendation**: Update the status to SETTLED and set winner_option_id to see how the bet is settled and how money is transferred to the winners.

### User Bets

14. **Create User Bet**
    - **POST /bets/{id}/user-bets**: Allows each authenticated user to create a user bet.
      - **Recommendation**: Create multiple user bets with different amounts to see how the odds of each bet option are calculated.
