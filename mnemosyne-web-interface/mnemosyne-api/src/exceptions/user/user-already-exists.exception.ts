import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
  constructor(
    message = 'user-already-exists',
    description = 'User already exists'
  ) {
    super(message, description);
  }
}
