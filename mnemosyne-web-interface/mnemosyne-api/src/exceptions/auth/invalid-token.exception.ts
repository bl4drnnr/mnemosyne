import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor(message = 'invalid-token', description = 'Invalid token') {
    super(message, description);
  }
}
