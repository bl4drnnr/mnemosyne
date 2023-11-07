import { IsEnum, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { Roles } from '@interfaces/roles.enum';
import { Role } from '@custom-types/role.type';

export class InviteUserToCompanyDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @ApiProperty({
    type: Roles,
    enum: Roles,
    description: DocsProperty.ROLES_DESC
  })
  @IsEnum(Roles, { message: ValidationError.WRONG_ROLE_VALUE })
  readonly role: Role;
}
