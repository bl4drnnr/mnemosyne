import { IsEnum, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { Roles } from '@interfaces/roles.enum';
import { Role } from '@custom-types/role.type';
import { ValidationError } from '@interfaces/validation-error.enum';

export class MemberRoleDto {
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @IsEnum(Roles, { message: ValidationError.WRONG_ROLE_VALUE })
  readonly role: Role;
}
