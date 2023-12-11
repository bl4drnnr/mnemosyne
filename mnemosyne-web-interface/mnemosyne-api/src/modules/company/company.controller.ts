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
import { CompanyId } from '@decorators/company-id.decorator';
import { UpdateCompanyDto } from '@dto/update-company.dto';
import { TransferOwnershipDto } from '@dto/transfer-ownership.dto';
import { DeleteCompanyDto } from '@dto/delete-company.dto';

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
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('company-information')
  getCompanyInformationById(
    @CompanyId() companyId: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.getCompanyInformationById({
      companyId,
      trx
    });
  }

  @ApiOperation(CompanyDocs.GetCompanyUsers.ApiOperation)
  @ApiExtraModels(...CompanyDocs.GetCompanyUsers.ApiExtraModels)
  @ApiResponse(CompanyDocs.GetCompanyUsers.ApiResponse)
  @ApiBadRequestResponse(CompanyDocs.GetCompanyUsers.ApiBadRequestResponse)
  @ApiQuery(CompanyDocs.GetCompanyUsers.ApiPageSizeQuery)
  @ApiQuery(CompanyDocs.GetCompanyUsers.ApiPageQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('company-users')
  getCompanyUsers(
    @CompanyId() companyId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.getCompanyUsers({
      companyId,
      page,
      pageSize,
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
  @Roles('ADMIN', 'PRIMARY_ADMIN')
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

  // @TODO Write docs here, but it is going to depend on the fact of what we are going to do with roles part of the whole project
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('transfer-ownership')
  transferCompanyOwnership(
    @CompanyId() companyId: string,
    @UserId() userId: string,
    @Body() payload: TransferOwnershipDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.transferCompanyOwnership({
      companyId,
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(CompanyDocs.DeleteCompanyAccount.ApiOperation)
  @ApiExtraModels(...CompanyDocs.DeleteCompanyAccount.ApiExtraModels)
  @ApiResponse(CompanyDocs.DeleteCompanyAccount.ApiResponse)
  @ApiBadRequestResponse(CompanyDocs.DeleteCompanyAccount.ApiBadRequestResponse)
  @ApiBody(CompanyDocs.DeleteCompanyAccount.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete('delete-company')
  deleteCompanyAccount(
    @CompanyId() companyId: string,
    @UserId() userId: string,
    @Body() payload: DeleteCompanyDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyService.deleteCompanyAccount({
      companyId,
      userId,
      payload,
      trx
    });
  }
}
