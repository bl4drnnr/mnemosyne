import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsFQDN,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested
} from 'class-validator';
import { EmailRegex } from '@regex/email.regex';
import { Type } from 'class-transformer';
import { Language } from '@interfaces/language.enum';
import { CompanyMembersType } from '@custom-types/company-members.type';
import { MemberRoleDto } from '@dto/member-role.dto';
import { ValidationError } from '@interfaces/validation-error.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { Roles } from '@interfaces/roles.enum';

export class CreateCompanyDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_LOCATION_DESC,
    example: DocsProperty.COMPANY_LOCATION_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_LOCATION_FORMAT })
  @Length(8, 128, { message: ValidationError.WRONG_LOCATION_LENGTH })
  readonly companyLocation: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_NAME_DESC,
    example: DocsProperty.COMPANY_NAME_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_COMPANY_FORMAT })
  @Length(2, 64, { message: ValidationError.WRONG_COMPANY_LENGTH })
  readonly companyName: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_WEBSITE_DESC,
    example: DocsProperty.COMPANY_WEBSITE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_FQDN })
  @IsFQDN()
  readonly companyWebsite: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly companyOwnerEmail: string;

  @ApiProperty({
    type: Array<MemberRoleDto>,
    description: DocsProperty.COMPANY_MEMBERS_DESC,
    example: [{ email: 'tim.cook@icloud.com', role: Roles.ADMIN }],
    isArray: true
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(5)
  @Type(() => MemberRoleDto)
  readonly companyMembers: CompanyMembersType;

  @ApiProperty({
    type: Boolean,
    description: DocsProperty.TAC_DESC,
    example: DocsProperty.TAC_EXAMPLE
  })
  @IsBoolean()
  readonly tac: boolean;

  @ApiProperty({
    type: Language,
    enum: Language,
    description: DocsProperty.LANGUAGE_DESC
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  readonly language?: Language;
}
