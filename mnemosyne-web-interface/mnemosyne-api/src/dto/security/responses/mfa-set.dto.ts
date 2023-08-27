import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class MfaSetDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.MFA_SET_DESC,
    example: DocsProperty.MFA_SET_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'mfa-set') {
    this.message = message;
  }
}
