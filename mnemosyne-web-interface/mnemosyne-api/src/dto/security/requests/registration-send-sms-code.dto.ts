import { IsMobilePhone, IsString } from 'class-validator';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: 'wrong-phone-format' })
  @IsMobilePhone()
  readonly phone: string;
}
