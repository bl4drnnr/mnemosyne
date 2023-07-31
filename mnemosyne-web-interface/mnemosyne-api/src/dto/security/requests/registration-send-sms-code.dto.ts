import { IsString, Matches } from 'class-validator';
import { PhoneRegex } from '@regex/phone.regex';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: 'wrong-phone-format' })
  @Matches(PhoneRegex, { message: 'wrong-phone-format' })
  readonly phone: string;
}
