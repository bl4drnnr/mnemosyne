import { ProductBySlugDto } from '@dto/product-by-slug.dto';
import { getSchemaPath } from '@nestjs/swagger';

export abstract class ProductsDocs {
  static get GetProductBySlug() {
    const ApiModels = [ProductBySlugDto];

    const apiOperationSum =
      'Endpoint is responsible for getting the product by the slug.';
    const apiResponseDesc =
      'As an endpoint user gets an instance of the product.';
    const slugQueryDesc =
      'Slug that is used in order to get the product by slug.';

    const slugQuery = {
      description: slugQueryDesc,
      name: 'slug',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductBySlugDto) }
      },
      ApiSlugQuery: slugQuery
    };
  }
}
