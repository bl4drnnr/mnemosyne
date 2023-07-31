import { Matches } from 'class-validator';

export class VerifySmsCode {
  @Matches(/^\d{6}$/, { message: 'phone-code-should-be-6-digit-code' })
  readonly phoneCode: string;
}
