import { BadRequestException } from '@nestjs/common';

export class InvalidTokenException extends BadRequestException {
  constructor(message = 'invalid-token') {
    super(message);
  }
}
