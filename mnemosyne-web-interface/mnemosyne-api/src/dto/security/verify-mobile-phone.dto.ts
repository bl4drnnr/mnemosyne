import { IsMobilePhone, IsString, Length } from 'class-validator';

export class VerifyMobilePhoneDto {
  @IsString({ message: 'Phone should be a string' })
  @IsMobilePhone()
  readonly phone: string;

  @IsString({ message: 'Should be 6 digit string code' })
  @Length(6, 6, { message: 'Should be 6 digit code' })
  readonly code: string;
}
