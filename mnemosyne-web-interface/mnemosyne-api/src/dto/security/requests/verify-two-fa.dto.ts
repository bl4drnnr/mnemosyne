import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { ValidationErrorEnum } from '@interfaces/validation-error.enum';

export class VerifyTwoFaDto {
  @Matches(MfaCodeRegex, { message: ValidationErrorEnum.WRONG_MFA_CODE_FORMAT })
  readonly code: string;

  @IsString({ message: ValidationErrorEnum.WRONG_TWO_FA_TOKEN_FORMAT })
  @Length(32, 32, { message: ValidationErrorEnum.WRONG_TWO_FA_TOKEN_LENGTH })
  readonly twoFaToken: string;

  @IsOptional()
  @Matches(EmailRegex, { message: ValidationErrorEnum.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @IsOptional()
  @Matches(PasswordRegex, {
    message: ValidationErrorEnum.WRONG_PASSWORD_FORMAT
  })
  readonly password: string;
}
