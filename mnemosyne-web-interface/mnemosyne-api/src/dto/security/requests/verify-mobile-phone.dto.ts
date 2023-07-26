import { IsMobilePhone, IsOptional, IsString, Matches } from 'class-validator';

export class VerifyMobilePhoneDto {
  @IsString({ message: 'wrong-phone-format' })
  @IsMobilePhone()
  readonly phone: string;

  @IsString({ message: 'mfa-code-should-be-6-digit-code' })
  @Matches(/^\d{6}$/, { message: 'mfa-code-should-be-6-digit-code' })
  readonly code: string;

  @IsOptional()
  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'wrong-email-format' }
  )
  readonly email: string;

  @IsOptional()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly password: string;
}