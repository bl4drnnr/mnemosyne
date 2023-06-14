import { BadRequestException } from '@nestjs/common';

export class WrongCodeException extends BadRequestException {
  constructor(message = 'wrong-code', description = 'Wrong code') {
    super(message, description);
  }
}
