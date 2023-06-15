import { IsString, Length } from 'class-validator';

export class VerifyTwoFaDto {
  @IsString({ message: 'Should be 6 digit string code' })
  @Length(6, 6, { message: 'Should be 6 digit code' })
  readonly code: string;
}
