import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class ResetUserPasswordDto {
  @IsOptional()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly password: string;

  @IsString({ message: 'wrong-hash-format' })
  @Length(40, 40, { message: 'wrong-hash-length' })
  readonly hash: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'mfa-code-should-be-6-digit-code' })
  readonly mfaCode: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'phone-code-should-be-6-digit-code' })
  readonly phoneCode: string;
}
