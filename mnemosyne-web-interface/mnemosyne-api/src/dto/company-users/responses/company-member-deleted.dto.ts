import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyMemberDeletedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_MEMBER_DELETED_DESC,
    example: DocsProperty.COMPANY_MEMBER_DELETED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-member-deleted') {
    this.message = message;
  }
}
