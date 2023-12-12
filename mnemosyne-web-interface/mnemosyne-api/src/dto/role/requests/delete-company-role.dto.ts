import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { IsString, Length } from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';

export class DeleteCompanyRoleDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_NAME_DESC,
    example: DocsProperty.COMPANY_ROLE_NAME_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_COMPANY_ROLE_NAME_FORMAT })
  @Length(2, 64, { message: ValidationError.WRONG_COMPANY_ROLE_NAME_LENGTH })
  readonly name: string;
}
