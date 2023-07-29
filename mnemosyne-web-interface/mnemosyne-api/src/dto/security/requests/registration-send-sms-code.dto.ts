import { IsString, Matches } from 'class-validator';

export class RegistrationSendSmsCodeDto {
  @IsString({ message: 'wrong-phone-format' })
  @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: 'wrong-phone-format' })
  readonly phone: string;
}
