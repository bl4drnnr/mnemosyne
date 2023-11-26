import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
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
import { CompanyService } from '@modules/company.service';
import { ValidationPipe } from '@pipes/validation.pipe';
import { CreateCompanyDto } from '@dto/create-company.dto';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CompanyDocs } from '@docs/company.docs';
import { AuthGuard } from '@guards/auth.guard';
import { Roles } from '@decorators/roles.decorator';
import { RoleGuard } from '@guards/role.guard';
import { UserId } from '@decorators/user-id.decorator';
import { DeleteCompanyDto } from '@dto/delete-company.dto';
import { CompanyId } from '@decorators/company-id.decorator';
import { UpdateCompanyDto } from '@dto/update-company.dto';

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
  @ApiBadRequestResponse(CompanyDocs.GetCompanyInfo.ApiBadRequestResponse)
  @ApiQuery(CompanyDocs.GetCompanyInfo.ApiCompanyIdQuery)
  @ApiQuery(CompanyDocs.GetCompanyInfo.ApiPageSizeQuery)
  @ApiQuery(CompanyDocs.GetCompanyInfo.ApiPageQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('company-information')
  getCompanyInformationById(
    @Query('companyId') companyId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.getCompanyInformationById({
      companyId,
      page,
      pageSize,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete('delete-company')
  deleteCompanyAccount(
    @UserId() userId: string,
    @Body() payload: DeleteCompanyDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.deleteCompanyAccount({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(CompanyDocs.UpdateCompanyInformation.ApiOperation)
  @ApiExtraModels(...CompanyDocs.UpdateCompanyInformation.ApiExtraModels)
  @ApiResponse(CompanyDocs.UpdateCompanyInformation.ApiResponse)
  @ApiBody(CompanyDocs.UpdateCompanyInformation.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('update-company')
  updateCompanyInformation(
    @CompanyId() companyId: string,
    @Body() payload: UpdateCompanyDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.updateCompanyInformation({
      companyId,
      payload,
      trx
    });
  }
}
