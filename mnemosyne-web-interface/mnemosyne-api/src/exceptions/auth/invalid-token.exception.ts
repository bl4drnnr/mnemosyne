import { BadRequestException } from '@nestjs/common';

export class InvalidTokenException extends BadRequestException {
  constructor(message = 'invalid-token', description = 'Invalid token') {
    super(message, description);
  }
}
