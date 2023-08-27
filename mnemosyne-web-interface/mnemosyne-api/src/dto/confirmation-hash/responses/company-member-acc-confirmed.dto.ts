import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyMemberAccConfirmedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_MEMBER_ACC_CONFIRMED_DESC,
    example: DocsProperty.COMPANY_MEMBER_ACC_CONFIRMED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-member-acc-confirmed') {
    this.message = message;
  }
}
