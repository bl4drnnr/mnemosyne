import { AllCategoriesInterface } from '@interfaces/all-categories.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GetAllCategoriesDto {
  @ApiProperty({
    type: Array<AllCategoriesInterface>,
    description: DocsProperty.GET_ALL_CATEGORIES_DESC,
    example: [
      {
        name: DocsProperty.CATEGORY_NAME_EXAMPLE,
        description: DocsProperty.CATEGORY_DESC_EXAMPLE,
        subCategories: [DocsProperty.SUBCATEGORY_EXAMPLE]
      }
    ]
  })
  categories: Array<AllCategoriesInterface>;

  constructor(categories: Array<AllCategoriesInterface>) {
    this.categories = categories;
  }
}
