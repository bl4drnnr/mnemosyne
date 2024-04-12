import {
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsUUID,
  Matches
} from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { Roles } from '@interfaces/roles.enum';
import { Role } from '@custom-types/role.type';
import { Language } from '@interfaces/language.enum';

class InvitedUser {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_ID_DESC,
    example: DocsProperty.COMPANY_ROLE_ID_EXAMPLE
  })
  @IsUUID('4')
  readonly roleId: string;
}

export class InviteUserToCompanyDto {
  @ApiProperty({
    type: Array<InvitedUser>,
    description: DocsProperty.INVITED_USER_DESC,
    example: [
      {
        email: DocsProperty.EMAIL_EXAMPLE,
        roleId: DocsProperty.ROLE_ID_EXAMPLE,
        roleName: DocsProperty.COMPANY_ROLE_NAME_EXAMPLE
      }
    ],
    isArray: true,
    minLength: 1
  })
  @ArrayMinSize(1, { message: ValidationError.WRONG_INVITED_USERS_LIST })
  readonly invitedUsers: Array<InvitedUser>;

  @ApiProperty({
    type: Language,
    enum: Language,
    description: DocsProperty.LANGUAGE_DESC,
    example: DocsProperty.LANGUAGE_EXAMPLE
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  readonly language?: Language;
}
