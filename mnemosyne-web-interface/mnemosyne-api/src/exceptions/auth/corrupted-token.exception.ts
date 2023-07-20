import { BadRequestException } from '@nestjs/common';

export class CorruptedTokenException extends BadRequestException {
  constructor(message = 'corrupted-token') {
    super(message);
  }
}
