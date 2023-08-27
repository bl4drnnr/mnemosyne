import { IsEnum, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { Roles } from '@interfaces/roles.enum';
import { Role } from '@custom-types/role.type';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class MemberRoleDto {
  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @IsEnum(Roles, { message: ValidationErrorEnum.WRONG_ROLE_VALUE })
  readonly role: Role;
}
