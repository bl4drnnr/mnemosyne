import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { CompanyService } from '@modules/company.service';
import { ValidationPipe } from '@pipes/validation.pipe';
import { CreateCompanyDto } from '@dto/create-company.dto';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CompanyDocs } from '@docs/company.docs';
import { AuthGuard } from '@guards/auth.guard';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation(CompanyDocs.CreateCompany.ApiOperation)
  @ApiExtraModels(...CompanyDocs.CreateCompany.ApiExtraModels)
  @ApiResponse(CompanyDocs.CreateCompany.ApiResponse)
  @ApiBadRequestResponse(CompanyDocs.CreateCompany.ApiBadRequestResponse)
  @ApiForbiddenResponse(CompanyDocs.CreateCompany.ApiForbiddenResponse)
  @ApiBody(CompanyDocs.CreateCompany.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('create-company')
  createCompany(
    @Body() payload: CreateCompanyDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.createCompany({ payload, trx });
  }

  @ApiOperation(CompanyDocs.GetCompanyInfo.ApiOperation)
  @ApiExtraModels(...CompanyDocs.GetCompanyInfo.ApiExtraModels)
  @ApiResponse(CompanyDocs.GetCompanyInfo.ApiResponse)
  @UseGuards(AuthGuard)
  @Get('company-information')
  getCompanyInformationById(
    @Query('companyId') companyId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.getCompanyInformationById({
      companyId,
      limit,
      page,
      trx
    });
  }
}
