import { ProductBySlugDto } from '@dto/product-by-slug.dto';
import { getSchemaPath, refs } from '@nestjs/swagger';
import { PostProductDto } from '@dto/post-product.dto';
import { ProductPostedDto } from '@dto/product-posted.dto';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { ProductNotFoundException } from '@exceptions/product-not-found.exception';
import { ProductBySlugToEditDto } from '@dto/product-by-slug-to-edit.dto';
import { ProductUpdatedDto } from '@dto/product-updated.dto';
import { CategoryNotFoundException } from '@exceptions/category-not-found.exception';

export abstract class ProductsDocs {
  static get GetProductBySlug() {
    const ApiModels = [ProductBySlugDto, ProductNotFoundException];

    const apiOperationSum =
      'Endpoint is responsible for getting the product by the slug.';
    const apiResponseDesc =
      'As an endpoint user gets an instance of the product.';
    const apiNotFoundDesc =
      'In case if the slug of the product has not been found, user gets this error message.';
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
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(ProductNotFoundException) }
      },
      ApiSlugQuery: slugQuery
    };
  }

  static get CreateProduct() {
    const ApiModels = [PostProductDto, ProductPostedDto, WrongPictureException];

    const apiOperationSum =
      'Endpoint is responsible for the creation of the product on the marketplace.';
    const apiResponseDesc =
      'As a response user gets a message that the product has been created and user gets redirected to the product page.';
    const apiBodyDesc =
      'Body contains all needed fields in order to create a product.';
    const apiBadRequestRespDesc =
      'If user tries to upload something else except of base64-encoded PNG picture.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductPostedDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongPictureException) }
      },
      ApiBody: {
        type: PostProductDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(PostProductDto) }
      } as ApiBodyOptions
    };
  }

  static get GetProductBySlugToEdit() {
    const ApiModels = [ProductNotFoundException, ProductBySlugToEditDto];

    const apiOperationSum =
      'Endpoint is responsible for getting the product by the slug to edition.';
    const apiResponseDesc =
      'As an endpoint user gets an instance of the product.';
    const apiNotFoundDesc =
      'In case if the slug of the product has not been found, user gets this error message.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductBySlugToEditDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(ProductNotFoundException) }
      }
    };
  }

  static get UpdateProduct() {
    const ApiModels = [
      ProductNotFoundException,
      ProductUpdatedDto,
      WrongPictureException,
      CategoryNotFoundException,
      PostProductDto
    ];
    const NotFoundRequests = [
      ProductNotFoundException,
      CategoryNotFoundException
    ];

    const apiOperationSum = 'Endpoint is responsible for a product update.';
    const apiResponseDesc =
      'As a response user gets a message that the product has been updated and user gets redirected to the product page.';
    const apiBodyDesc =
      'Body contains all needed fields in order to create a product.';
    const apiNotFoundDesc =
      'Not found exception is thrown in case if product category or product itself is not found.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductUpdatedDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { oneOf: refs(...NotFoundRequests) }
      },
      ApiBody: {
        type: PostProductDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(PostProductDto) }
      } as ApiBodyOptions
    };
  }
}
