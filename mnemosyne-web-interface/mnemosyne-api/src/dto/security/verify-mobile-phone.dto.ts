import { IsMobilePhone, IsOptional, IsString, Matches } from 'class-validator';

export class VerifyMobilePhoneDto {
  @IsString({ message: 'Phone should be a string' })
  @IsMobilePhone()
  readonly phone: string;

  @IsString({ message: 'Should be 6 digit string code' })
  @Matches(/^\d{6}$/, { message: 'Should be 6 digit code' })
  readonly code: string;

  @IsOptional()
  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'Wrong email format' }
  )
  readonly email: string;

  @IsOptional()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Wrong password format'
  })
  readonly password: string;
}
