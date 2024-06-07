enum ErrorMessages {
  USERNAME_ALREADY_EXISTS = 'Username already exists',
  INVALID_PASSWORD = 'Invalid password',
  USER_NOT_FOUND = 'User not found',
  TAG_NOT_FOUND = 'Tag not found',
  USER_IS_BLOCKED = 'User is blocked',
  USER_NOT_ADMIN = 'Your user is not an admin',
  CANNOT_UPDATE_ADMIN = 'You cannot update an admin user',
  CANNOT_UPDATE_THIS_USER = 'You cannot update this user',
  BET_NOT_FOUND = 'Bet not found',
  DRAW_OPTION_REQUIRED = "You must include a draw option ('name':'draw') if you give 3 options. Otherwise, you can only give 2 options.",
  NO_OPTIONS_PROVIDED = 'No options were provided',
  INCORRECT_WINNER_OPTION_ID = 'Incorrect winner_option_id',
  INVALID_TRANSACTION_TYPE = 'Invalid transaction type',
  INSUFFICIENT_FUNDS_FOR_WITHDRAW = 'Insufficient funds for withdraw',
  BET_OPTION_NOT_FOUND = 'Bet option not found',
  INSUFFICIENT_FUNDS_FOR_BET = 'Insufficient funds for bet. You need to have at least the amount of the bet.',
  BET_NOT_ACTIVE = 'Bet is not active',
}

export default ErrorMessages;
