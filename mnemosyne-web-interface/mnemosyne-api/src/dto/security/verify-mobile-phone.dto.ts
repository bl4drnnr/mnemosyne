import { IsMobilePhone, IsString, Matches } from 'class-validator';

export class VerifyMobilePhoneDto {
  @IsString({ message: 'Phone should be a string' })
  @IsMobilePhone()
  readonly phone: string;

  @IsString({ message: 'Should be 6 digit string code' })
  @Matches(/^\d{6}$/, { message: 'Should be 6 digit code' })
  readonly code: string;
}
