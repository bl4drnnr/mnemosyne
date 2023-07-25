import { BadRequestException } from '@nestjs/common';

export class WrongMfaTokenException extends BadRequestException {
  constructor(message = 'wrong-mfa-token') {
    super(message);
  }
}
