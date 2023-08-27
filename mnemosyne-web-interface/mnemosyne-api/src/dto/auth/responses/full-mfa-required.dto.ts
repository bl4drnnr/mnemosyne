import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class FullMfaRequiredDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.FULL_MFA_REQUIRED_DESC,
    example: DocsProperty.FULL_MFA_REQUIRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'full-mfa-required') {
    this.message = message;
  }
}
