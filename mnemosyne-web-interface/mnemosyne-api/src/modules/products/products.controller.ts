import { Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ProductsService } from '@modules/products.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ProductsDocs } from '@docs/products.docs';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation(ProductsDocs.GetProductBySlug.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetProductBySlug.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetProductBySlug.ApiResponse)
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
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.searchProduct({
      query,
      page,
      pageSize,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @Post('create-product')
  createProduct() {
    return this.productsService.createProduct();
  }
}
