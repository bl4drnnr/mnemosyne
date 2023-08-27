import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class RecoveryKeysNotSetDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.RECOVERY_KEYS_NOT_SET_DESC,
    example: DocsProperty.RECOVERY_KEYS_NOT_SET_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'recovery-keys-not-set') {
    this.message = message;
  }
}
