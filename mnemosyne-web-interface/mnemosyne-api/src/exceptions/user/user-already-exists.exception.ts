import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
  constructor(message = 'user-already-exists') {
    super(message);
  }
}
