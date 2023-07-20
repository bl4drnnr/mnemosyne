import { IsOptional, Length, Matches } from 'class-validator';

export class ResetUserPasswordDto {
  @IsOptional()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Wrong password format'
  })
  readonly password?: string;

  @Length(40, 40, { message: 'Wrong hash length' })
  readonly hash: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'Should be 6 digit code' })
  readonly mfaCode?: string;

  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'Should be 6 digit code' })
  readonly phoneCode?: string;
}
