import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class RecoveryKeysResponseDto {
  @ApiProperty({
    type: Array<string>,
    description: DocsProperty.RECOVERY_KEYS_DESC,
    example: [
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE,
      DocsProperty.RECOVERY_KEY_EXAMPLE
    ],
    isArray: true,
    minLength: 5,
    maxLength: 5
  })
  readonly recoveryKeys: Array<string>;

  constructor(recoveryKeys: Array<string>) {
    this.recoveryKeys = recoveryKeys;
  }
}
