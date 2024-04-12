import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserNotMemberException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_NOT_COMPANY_MEMBER_EXCEPTION_DESC,
    example: DocsProperty.USER_NOT_COMPANY_MEMBER_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-not-company-member') {
    super(message);
    this.message = message;
  }
}
