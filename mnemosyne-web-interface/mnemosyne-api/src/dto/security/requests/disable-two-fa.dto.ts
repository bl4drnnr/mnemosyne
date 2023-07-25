import { Matches } from 'class-validator';

export class DisableTwoFaDto {
  @Matches(/^\d{6}$/, { message: 'mfa-code-should-be-6-digit-code' })
  readonly code: string;
}
