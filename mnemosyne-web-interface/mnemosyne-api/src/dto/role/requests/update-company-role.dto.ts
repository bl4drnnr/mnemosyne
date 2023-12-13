import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { ArrayMinSize, IsString, Length } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { RoleScope } from '@custom-types/role-scope.type';

export class UpdateCompanyRoleDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_NAME_DESC,
    example: DocsProperty.COMPANY_ROLE_NAME_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_COMPANY_ROLE_NAME_FORMAT })
  @Length(2, 64, { message: ValidationError.WRONG_COMPANY_ROLE_NAME_LENGTH })
  readonly name: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_DESC_DESC,
    example: DocsProperty.COMPANY_ROLE_DESC_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_COMPANY_ROLE_DESC_FORMAT })
  @Length(2, 128, { message: ValidationError.WRONG_COMPANY_ROLE_DESC_LENGTH })
  readonly description: string;

  @ApiProperty({
    type: Array<RoleScope>,
    description: DocsProperty.COMPANY_ROLE_SCOPES_DESC,
    example: DocsProperty.COMPANY_ROLE_SCOPES_EXAMPLE,
    isArray: true
  })
  @ArrayMinSize(1, { message: ValidationError.WRONG_COMPANY_ROLE_SCOPE_LENGTH })
  readonly roleScopes: Array<RoleScope>;
}
