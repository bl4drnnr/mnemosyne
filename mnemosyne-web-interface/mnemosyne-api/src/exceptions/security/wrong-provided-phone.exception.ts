import { BadRequestException } from '@nestjs/common';

export class WrongProvidedPhoneException extends BadRequestException {
  constructor(message = 'wrong-provided-phone') {
    super(message);
  }
}
