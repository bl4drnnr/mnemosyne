import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { MfaCodeRegex } from '@regex/mfa-code.regex';
import { LANGUAGE_TYPES } from '@interfaces/language.types';

export class ResetUserPasswordDto {
  @IsOptional()
  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;

  @IsString({ message: 'wrong-hash-format' })
  @Length(40, 40, { message: 'wrong-hash-length' })
  readonly hash: string;

  @IsOptional()
  @Matches(MfaCodeRegex, { message: 'mfa-code-should-be-6-digit-code' })
  readonly mfaCode: string;

  @IsOptional()
  @Matches(MfaCodeRegex, { message: 'phone-code-should-be-6-digit-code' })
  readonly phoneCode: string;

  @IsOptional()
  @IsEnum(LANGUAGE_TYPES)
  readonly language: LANGUAGE_TYPES;
}
