import { Matches } from 'class-validator';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class DisableTwoFaDto {
  @Matches(MfaCodeRegex, { message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  readonly code: string;
}
