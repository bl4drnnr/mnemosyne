import { UnauthorizedException } from '@nestjs/common';

export class ExpiredTokenException extends UnauthorizedException {
  constructor(message = 'token-expired', description = 'Token expired') {
    super(message, description);
  }
}
