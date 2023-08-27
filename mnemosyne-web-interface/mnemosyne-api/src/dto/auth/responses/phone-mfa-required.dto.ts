import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PhoneMfaRequiredDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_REQUIRED_DESC,
    example: DocsProperty.PHONE_REQUIRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'phone-required') {
    this.message = message;
  }
}
