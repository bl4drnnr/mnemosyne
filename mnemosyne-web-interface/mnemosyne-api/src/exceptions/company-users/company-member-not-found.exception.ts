import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyMemberNotFoundException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_MEMBER_NOT_FOUND_DESC,
    example: DocsProperty.COMPANY_MEMBER_NOT_FOUND_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-member-not-found') {
    super(message);
    this.message = message;
  }
}
