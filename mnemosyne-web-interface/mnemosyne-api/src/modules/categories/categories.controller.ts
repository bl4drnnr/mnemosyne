import { Controller, Get } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CategoriesService } from '@modules/categories.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CategoriesDocs } from '@docs/categories.docs';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation(CategoriesDocs.GetAllCategories.ApiOperation)
  @ApiExtraModels(...CategoriesDocs.GetAllCategories.ApiExtraModels)
  @ApiResponse(CategoriesDocs.GetAllCategories.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @Get('all-categories')
  getAllCategories(@TrxDecorator() trx: Transaction) {
    return this.categoriesService.getAllCategories({ trx });
  }
}
