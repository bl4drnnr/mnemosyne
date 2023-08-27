import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyExistsException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_EXISTS_DESC,
    example: DocsProperty.COMPANY_EXISTS_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-already-exists') {
    super(message);
    this.message = message;
  }
}
