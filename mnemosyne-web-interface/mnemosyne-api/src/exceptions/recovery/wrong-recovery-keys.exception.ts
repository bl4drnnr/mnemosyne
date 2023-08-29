import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongRecoveryKeysException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_RECOVERY_KEYS_DESC,
    example: DocsProperty.WRONG_RECOVERY_KEYS_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-recovery-keys') {
    super(message);
    this.message = message;
  }
}
