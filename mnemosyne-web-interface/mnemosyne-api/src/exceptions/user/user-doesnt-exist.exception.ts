import { NotFoundException } from '@nestjs/common';

export class UserDoesntExistException extends NotFoundException {
  constructor(
    message = 'user-doesnt-exist',
    description = "User doesn't exist"
  ) {
    super(message, description);
  }
}
