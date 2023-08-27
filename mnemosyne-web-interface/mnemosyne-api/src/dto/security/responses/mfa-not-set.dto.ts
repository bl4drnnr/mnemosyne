import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class MfaNotSetDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.MFA_NOT_SET_DESC,
    example: DocsProperty.MFA_NOT_SET_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'mfa-not-set') {
    this.message = message;
  }
}
