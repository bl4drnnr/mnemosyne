import { Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class InviteUserToCompanyDto {
  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly email: string;
}
