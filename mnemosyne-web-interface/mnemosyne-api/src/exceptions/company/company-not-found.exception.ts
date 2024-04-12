import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyNotFoundException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_NOT_FOUND_EXCEPTION_DESC,
    example: DocsProperty.COMPANY_NOT_FOUND_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-not-found') {
    super(message);
    this.message = message;
  }
}
