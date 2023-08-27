import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class MfaDisabledDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.MFA_DISABLED_DESC,
    example: DocsProperty.MFA_DISABLED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'mfa-disabled') {
    this.message = message;
  }
}
