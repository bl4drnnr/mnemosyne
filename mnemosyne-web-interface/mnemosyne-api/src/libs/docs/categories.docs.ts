import { getSchemaPath } from '@nestjs/swagger';
import { GetAllCategoriesDto } from '@dto/get-all-categories.dto';

export abstract class CategoriesDocs {
  static get GetAllCategories() {
    const ApiModels = [GetAllCategoriesDto];

    const apiOperationSum =
      'Endpoint is responsible for getting all categories.';
    const apiResponseDesc =
      'As a response user gets the array of the all categories along with subcategories';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetAllCategoriesDto) }
      }
    };
  }
}
