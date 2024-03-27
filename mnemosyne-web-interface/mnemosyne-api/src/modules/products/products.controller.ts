import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ProductsService } from '@modules/products.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ProductsDocs } from '@docs/products.docs';
import { UserId } from '@decorators/user-id.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { PostProductDto } from '@dto/post-product.dto';
import { DeleteProductDto } from '@dto/delete-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation(ProductsDocs.GetProductBySlug.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetProductBySlug.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetProductBySlug.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.GetProductBySlug.ApiNotFoundResponse)
  @ApiQuery(ProductsDocs.GetProductBySlug.ApiSlugQuery)
  @ApiBasicAuth('basicAuth')
  @Get('product')
  getProductBySlug(
    @Query('slug') slug: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getProductBySlug({ slug, trx });
  }

  @ApiBasicAuth('basicAuth')
  @Get('latest-products')
  getLatestProducts(@TrxDecorator() trx: Transaction) {
    return this.productsService.getLatestProducts({ trx });
  }

  @ApiBasicAuth('basicAuth')
  @Get('search-product')
  searchProduct(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.searchProduct({
      query,
      page,
      pageSize,
      order,
      orderBy,
      trx
    });
  }

  @ApiOperation(ProductsDocs.CreateProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.CreateProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.CreateProduct.ApiResponse)
  @ApiBadRequestResponse(ProductsDocs.CreateProduct.ApiBadRequestResponse)
  @ApiBody(ProductsDocs.CreateProduct.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-product')
  createProduct(
    @UserId() userId: string,
    @Body() payload: PostProductDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.createProduct({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetProductBySlugToEdit.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetProductBySlugToEdit.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetProductBySlugToEdit.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.GetProductBySlugToEdit.ApiNotFoundResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('get-product-by-slug-to-edit')
  getProductBySlugToEdit(
    @UserId() userId: string,
    @Query('slug') slug: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getProductBySlugToEdit({
      userId,
      slug,
      trx
    });
  }

  @ApiOperation(ProductsDocs.UpdateProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.UpdateProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.UpdateProduct.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.UpdateProduct.ApiNotFoundResponse)
  @ApiBody(ProductsDocs.UpdateProduct.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-product')
  updateProduct(
    @UserId() userId: string,
    @Body() payload: PostProductDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.updateProduct({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetUserProducts.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetUserProducts.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetUserProducts.ApiResponse)
  @ApiBadRequestResponse(ProductsDocs.GetUserProducts.ApiBadRequestResponse)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiPageSizeQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiPageQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiProductQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiOrderQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiOrderByQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('user-products')
  getUserProducts(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getUserProducts({
      query,
      page,
      pageSize,
      order,
      orderBy,
      userId,
      trx
    });
  }

  @ApiOperation(ProductsDocs.DeleteProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.DeleteProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.DeleteProduct.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.DeleteProduct.ApiNotFoundResponse)
  @ApiBadRequestResponse(ProductsDocs.DeleteProduct.ApiBadRequestResponse)
  @ApiBody(ProductsDocs.DeleteProduct.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Delete('product')
  deleteProduct(
    @UserId() userId: string,
    @Body() payload: DeleteProductDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.deleteProduct({
      userId,
      payload,
      trx
    });
  }
}
