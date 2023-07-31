import { Matches } from 'class-validator';
import { MfaCodeRegex } from '@regex/mfa-code.regex';

export class DisableTwoFaDto {
  @Matches(MfaCodeRegex, { message: 'mfa-code-should-be-6-digit-code' })
  readonly code: string;
}
