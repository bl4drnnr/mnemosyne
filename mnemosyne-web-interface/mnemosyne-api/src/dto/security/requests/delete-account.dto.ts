import { IsOptional, IsString, Matches } from 'class-validator';

export class DeleteAccountDto {
  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'wrong-email-format' }
  )
  readonly email: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly password: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'mfa-code-should-be-6-digit-code' })
  readonly mfaCode?: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'phone-code-should-be-6-digit-code' })
  readonly phoneCode?: string;

  @IsOptional()
  @IsString()
  readonly fullName?: string;
}
