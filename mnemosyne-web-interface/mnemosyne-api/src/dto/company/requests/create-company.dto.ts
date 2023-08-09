import { IsFQDN, IsString, Length, Matches } from 'class-validator';
import { EmailRegex } from '@regex/email.regex';

export class CreateCompanyDto {
  @IsString({ message: 'wrong-location-format' })
  @Length(8, 128, { message: 'wrong-location-length' })
  companyLocation: string;

  @IsString({ message: 'wrong-company-format' })
  @Length(2, 64, { message: 'wrong-company-length' })
  companyName: string;

  @IsString({ message: 'wrong-fqdn' })
  @IsFQDN()
  companyWebsite: string;

  @Matches(EmailRegex, { message: 'wrong-email-format' })
  accountOwnerEmail: string;
}
