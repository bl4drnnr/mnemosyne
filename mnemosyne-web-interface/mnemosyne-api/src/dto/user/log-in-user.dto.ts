import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class LogInUserDto {
  @IsEmail({}, { message: 'Should be email' })
  readonly email: string;

  @IsString({ message: 'Password should be a string' })
  @Length(8, 64, { message: 'Min length of password is 8, max is 64' })
  readonly password: string;

  @IsOptional()
  @Length(6, 6, { message: 'Phone code should be 6 digit code' })
  readonly phoneCode?: string;

  @IsOptional()
  @Length(6, 6, { message: 'MFA code should be 6 digit code' })
  readonly mfaCode?: string;
}
