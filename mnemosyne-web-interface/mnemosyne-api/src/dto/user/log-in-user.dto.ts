import { IsOptional, Length, Matches } from 'class-validator';

export class LogInUserDto {
  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'Wrong email format' }
  )
  readonly email: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Wrong password format'
  })
  readonly password: string;

  @IsOptional()
  @Length(6, 6, { message: 'Phone code should be 6 digit code' })
  readonly phoneCode?: string;

  @IsOptional()
  @Length(6, 6, { message: 'MFA code should be 6 digit code' })
  readonly mfaCode?: string;
}
