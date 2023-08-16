import { IsEnum, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { Roles } from '@interfaces/roles.enum';
import { Role } from '@custom-types/role.type';

export class MemberRoleDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;

  @IsEnum(Roles, { message: 'wrong-role-value' })
  readonly role: Role;
}
