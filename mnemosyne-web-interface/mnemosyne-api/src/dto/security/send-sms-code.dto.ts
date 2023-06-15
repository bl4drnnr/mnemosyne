import { IsMobilePhone, IsString } from 'class-validator';

export class SendSmsCodeDto {
  @IsString({ message: 'Phone should be a string' })
  @IsMobilePhone()
  readonly phone: string;
}
