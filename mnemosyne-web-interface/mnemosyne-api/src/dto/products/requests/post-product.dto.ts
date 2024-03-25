import { ProductCurrency } from '@interfaces/product-currency.enum';
import { ProductSubcategory } from '@interfaces/product-subcategory.enum';
import { ProductCategory } from '@interfaces/product-category.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min
} from 'class-validator';
import { ValidationError } from '@interfaces/validation-error.enum';
import { PhoneRegex } from '@regex/phone.regex';

export class PostProductDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_ID_DESC,
    example: DocsProperty.PRODUCT_ID_EXAMPLE
  })
  @IsUUID('4')
  @ApiPropertyOptional()
  @IsOptional()
  readonly id?: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_TITLE_DESC,
    example: DocsProperty.PRODUCT_TITLE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PRODUCT_TITLE_FORMAT })
  @Length(16, 70, { message: ValidationError.WRONG_PRODUCT_TITLE_LENGTH })
  readonly title: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_DESC_DESC,
    example: DocsProperty.PRODUCT_DESC_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PRODUCT_DESCRIPTION_FORMAT })
  @Length(40, 9000, {
    message: ValidationError.WRONG_PRODUCT_DESCRIPTION_LENGTH
  })
  readonly description: string;

  @ApiProperty({
    type: Array<string>,
    description: DocsProperty.PRODUCT_PIC_DESC,
    example: [DocsProperty.PRODUCT_PIC_EXAMPLE],
    isArray: true
  })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(8)
  readonly pictures: Array<string>;

  @ApiProperty({
    type: ProductCurrency,
    enum: ProductCurrency,
    description: DocsProperty.PRODUCT_CURRENCY_DESC,
    example: DocsProperty.PRODUCT_CURRENCY_EXAMPLE
  })
  @IsEnum(ProductCurrency)
  readonly currency: ProductCurrency;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_PRICE_DESC,
    example: DocsProperty.PRODUCT_PRICE_EXAMPLE
  })
  @IsNumber(
    { allowNaN: false },
    { message: ValidationError.WRONG_PRODUCT_PRICE_FORMAT }
  )
  @Min(0)
  readonly price: number;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_LOCATION_DESC,
    example: DocsProperty.PRODUCT_LOCATION_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PRODUCT_LOCATION_FORMAT })
  @Length(4, 64, { message: ValidationError.WRONG_PRODUCT_LOCATION_LENGTH })
  readonly location: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_CONTACT_PHONE_DESC,
    example: DocsProperty.PRODUCT_CONTACT_PHONE_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PHONE_FORMAT })
  @Matches(PhoneRegex, { message: ValidationError.WRONG_PHONE_FORMAT })
  readonly contactPhone: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_CONTACT_PERSON_DESC,
    example: DocsProperty.PRODUCT_CONTACT_PERSON_EXAMPLE
  })
  @IsString({ message: ValidationError.WRONG_PRODUCT_CONTACT_PERSON_FORMAT })
  @Length(1, 64, {
    message: ValidationError.WRONG_PRODUCT_CONTACT_PERSON_LENGTH
  })
  readonly contactPerson: string;

  @ApiProperty({
    type: ProductCategory,
    enum: ProductCategory,
    description: DocsProperty.CATEGORY_NAME_DESC,
    example: DocsProperty.CATEGORY_NAME_EXAMPLE
  })
  @IsEnum(ProductCategory)
  readonly category: ProductCategory;

  @ApiProperty({
    type: ProductSubcategory,
    enum: ProductSubcategory,
    description: DocsProperty.SUBCATEGORY_DESC,
    example: DocsProperty.SUBCATEGORY_EXAMPLE
  })
  @IsEnum(ProductSubcategory)
  readonly subcategory: ProductSubcategory;
}
