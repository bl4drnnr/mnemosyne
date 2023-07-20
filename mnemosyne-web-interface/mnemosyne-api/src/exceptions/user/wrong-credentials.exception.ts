import { BadRequestException } from '@nestjs/common';

export class WrongCredentialsException extends BadRequestException {
  constructor(message = 'wrong-credentials') {
    super(message);
  }
}
