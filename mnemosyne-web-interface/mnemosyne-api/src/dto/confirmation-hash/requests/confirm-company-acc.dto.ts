import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PasswordRegex } from '@regex/password.regex';
import { Language } from '@interfaces/language.enum';

export class ConfirmCompanyAccDto {
  @IsOptional()
  @IsString({ message: 'wrong-first-name-format' })
  @Length(1, 64, { message: 'wrong-first-name-length' })
  readonly firstName: string;

  @IsOptional()
  @IsString({ message: 'wrong-last-name-format' })
  @Length(1, 64, { message: 'wrong-last-name-length' })
  readonly lastName: string;

  @IsOptional()
  @Matches(PasswordRegex, { message: 'wrong-password-format' })
  readonly password: string;

  @IsOptional()
  @IsEnum(Language)
  readonly language: Language;
}
