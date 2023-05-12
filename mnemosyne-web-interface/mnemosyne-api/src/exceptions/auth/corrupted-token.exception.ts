import { UnauthorizedException } from '@nestjs/common';

export class CorruptedTokenException extends UnauthorizedException {
  constructor(message = 'corrupted-token', description = 'Corrupted token') {
    super(message, description);
  }
}
