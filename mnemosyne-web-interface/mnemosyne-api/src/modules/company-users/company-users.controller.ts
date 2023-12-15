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
import { CompanyUsersService } from '@modules/company-users.service';
import {
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
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { RoleGuard } from '@guards/role.guard';
import { UserId } from '@decorators/user-id.decorator';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { Roles } from '@decorators/roles.decorator';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { CompanyUsersDocs } from '@docs/company-users.docs';
import { CompanyId } from '@decorators/company-id.decorator';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { DeleteCompanyMemberDto } from '@dto/delete-company-member.dto';

@ApiTags('Company Users')
@Controller('company-users')
export class CompanyUsersController {
  constructor(private readonly companyUsersService: CompanyUsersService) {}

  @ApiOperation(CompanyUsersDocs.InviteUser.ApiOperation)
  @ApiExtraModels(...CompanyUsersDocs.InviteUser.ApiExtraModels)
  @ApiResponse(CompanyUsersDocs.InviteUser.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('invite-user')
  inviteUser(
    @UserId() userId: string,
    @Body() payload: InviteUserToCompanyDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.companyUsersService.inviteUserToCompany({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(CompanyUsersDocs.GetCompanyMemberInfo.ApiOperation)
  @ApiExtraModels(...CompanyUsersDocs.GetCompanyMemberInfo.ApiExtraModels)
  @ApiResponse(CompanyUsersDocs.GetCompanyMemberInfo.ApiResponse)
  @ApiNotFoundResponse(
    CompanyUsersDocs.GetCompanyMemberInfo.ApiNotFoundResponse
  )
  @ApiQuery(CompanyUsersDocs.GetCompanyMemberInfo.ApiMemberIdQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('company-member-info')
  getCompanyMemberInfo(
    @CompanyId() companyId: string,
    @Query('memberId') memberId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.companyUsersService.getCompanyMemberInfo({
      companyId,
      memberId,
      trx
    });
  }

  @ApiOperation(CompanyUsersDocs.UpdateCompanyMemberInfo.ApiOperation)
  @ApiExtraModels(...CompanyUsersDocs.UpdateCompanyMemberInfo.ApiExtraModels)
  @ApiResponse(CompanyUsersDocs.UpdateCompanyMemberInfo.ApiResponse)
  @ApiNotFoundResponse(
    CompanyUsersDocs.UpdateCompanyMemberInfo.ApiNotFoundResponse
  )
  @ApiBody(CompanyUsersDocs.UpdateCompanyMemberInfo.ApiBody)
  @ApiQuery(CompanyUsersDocs.UpdateCompanyMemberInfo.ApiMemberIdQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('company-member-info')
  updateCompanyMemberInfo(
    @CompanyId() companyId: string,
    @Body() payload: UpdateUserInfoDto,
    @Query('memberId') memberId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.companyUsersService.updateCompanyMemberInfo({
      companyId,
      payload,
      memberId,
      trx
    });
  }

  @ApiOperation(CompanyUsersDocs.DeleteCompanyMember.ApiOperation)
  @ApiExtraModels(...CompanyUsersDocs.DeleteCompanyMember.ApiExtraModels)
  @ApiResponse(CompanyUsersDocs.DeleteCompanyMember.ApiResponse)
  @ApiNotFoundResponse(CompanyUsersDocs.DeleteCompanyMember.ApiNotFoundResponse)
  @ApiBody(CompanyUsersDocs.DeleteCompanyMember.ApiBody)
  @ApiQuery(CompanyUsersDocs.DeleteCompanyMember.ApiMemberIdQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete('delete-company-member')
  deleteCompanyMember(
    @UserId() userId: string,
    @CompanyId() companyId: string,
    @Body() payload: DeleteCompanyMemberDto,
    @Query('memberId') memberId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.companyUsersService.deleteCompanyMember({
      userId,
      companyId,
      payload,
      memberId,
      trx
    });
  }

  @ApiOperation(CompanyUsersDocs.SearchCompanyMembers.ApiOperation)
  @ApiExtraModels(...CompanyUsersDocs.SearchCompanyMembers.ApiExtraModels)
  @ApiResponse(CompanyUsersDocs.SearchCompanyMembers.ApiResponse)
  @ApiQuery(CompanyUsersDocs.SearchCompanyMembers.ApiMemberQuery)
  @ApiQuery(CompanyUsersDocs.SearchCompanyMembers.ApiPageSizeQuery)
  @ApiQuery(CompanyUsersDocs.SearchCompanyMembers.ApiPageQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('search-company-members')
  searchCompanyMembers(
    @CompanyId() companyId: string,
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.companyUsersService.searchCompanyMembers({
      companyId,
      query,
      page,
      pageSize,
      trx
    });
  }
}
