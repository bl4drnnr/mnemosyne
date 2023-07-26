import { IsMobilePhone, IsOptional, IsString, Matches } from 'class-validator';

export class LoginSendSmsDto {
  @IsString({ message: 'wrong-phone-format' })
  @IsMobilePhone()
  readonly phone: string;

  @Matches(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    { message: 'wrong-email-format' }
  )
  readonly email: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'wrong-password-format'
  })
  readonly password: string;
}
