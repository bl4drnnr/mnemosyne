import { Matches } from 'class-validator';

export class VerifyTwoFaDto {
  @Matches(/^\d{6}$/, { message: 'Should be 6 digit code' })
  readonly code: string;
}
