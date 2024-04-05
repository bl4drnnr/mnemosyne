import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GetProductContactPhoneDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_DESC,
    example: DocsProperty.PHONE_EXAMPLE
  })
  readonly contactPhone: string;

  constructor(contactPhone: string) {
    this.contactPhone = contactPhone;
  }
}
