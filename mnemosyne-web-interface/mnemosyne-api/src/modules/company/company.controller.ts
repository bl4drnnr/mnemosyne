import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CompanyService } from '@modules/company.service';
import { ValidationPipe } from '@pipes/validation.pipe';
import { CreateCompanyDto } from '@dto/create-company.dto';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CompanyDocs } from '@docs/company.docs';

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
  @UsePipes(ValidationPipe)
  @Post('create-company')
  createCompany(
    @Body() payload: CreateCompanyDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.createCompany({ payload, trx });
  }
}
