import { IsOptional, Matches } from 'class-validator';

export class ChangePasswordDto {
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly currentPassword: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly newPassword: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'mfa-code-should-be-6-digit-code' })
  readonly mfaCode: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'phone-code-should-be-6-digit-code' })
  readonly phoneCode: string;
}
