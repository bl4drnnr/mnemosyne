import { Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';

export class InviteUserToCompanyDto {
  @Matches(EmailRegex, { message: 'wrong-email-format' })
  readonly email: string;
}
