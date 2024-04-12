import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { IsUUID } from 'class-validator';

export class ChangeCompanyMemberRoleDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_ID_DESC,
    example: DocsProperty.COMPANY_ROLE_ID_EXAMPLE
  })
  @IsUUID('4')
  readonly newRoleId: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.USER_ID_DESC,
    example: DocsProperty.USER_ID_EXAMPLE
  })
  @IsUUID('4')
  readonly userId: string;
}
