import { BadRequestException } from '@nestjs/common';

export class WrongRecoveryKeysException extends BadRequestException {
  constructor(message = 'wrong-recovery-keys') {
    super(message);
  }
}
