import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { RolesService } from '@modules/roles.service';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ValidationPipe } from '@pipes/validation.pipe';
import { Roles } from '@decorators/roles.decorator';
import { RoleGuard } from '@guards/role.guard';
import { AuthGuard } from '@guards/auth.guard';
import { CompanyId } from '@decorators/company-id.decorator';
import { CreateCompanyRoleDto } from '@dto/create-company-role.dto';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';
import { RolesDocs } from '@docs/roles.docs';
import { ChangeCompanyMemberRoleDto } from '@dto/change-company-member-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation(RolesDocs.GetCompanyRoles.ApiOperation)
  @ApiExtraModels(...RolesDocs.GetCompanyRoles.ApiExtraModels)
  @ApiResponse(RolesDocs.GetCompanyRoles.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ROLES_MANAGEMENT')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('get-company-roles')
  getCompanyRoles(
    @CompanyId() companyId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.rolesService.getCompanyRoles({
      companyId,
      trx
    });
  }

  @ApiOperation(RolesDocs.CreateRole.ApiOperation)
  @ApiExtraModels(...RolesDocs.CreateRole.ApiExtraModels)
  @ApiResponse(RolesDocs.CreateRole.ApiResponse)
  @ApiBadRequestResponse(RolesDocs.CreateRole.ApiBadRequestResponse)
  @ApiBody(RolesDocs.CreateRole.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ROLES_MANAGEMENT')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('create-role')
  createCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: CreateCompanyRoleDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.rolesService.createCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiOperation(RolesDocs.UpdateCompanyRole.ApiOperation)
  @ApiExtraModels(...RolesDocs.UpdateCompanyRole.ApiExtraModels)
  @ApiResponse(RolesDocs.UpdateCompanyRole.ApiResponse)
  @ApiNotFoundResponse(RolesDocs.UpdateCompanyRole.ApiNotFoundResponse)
  @ApiBody(RolesDocs.UpdateCompanyRole.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ROLES_MANAGEMENT')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('update-role')
  updateCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: UpdateCompanyRoleDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.rolesService.updateCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiOperation(RolesDocs.ChangeCompanyMemberRole.ApiOperation)
  @ApiExtraModels(...RolesDocs.ChangeCompanyMemberRole.ApiExtraModels)
  @ApiResponse(RolesDocs.ChangeCompanyMemberRole.ApiResponse)
  @ApiNotFoundResponse(RolesDocs.ChangeCompanyMemberRole.ApiNotFoundResponse)
  @ApiBody(RolesDocs.ChangeCompanyMemberRole.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ROLES_MANAGEMENT')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('change-company-member-role')
  changeCompanyMemberRole(
    @CompanyId() companyId: string,
    @Body() payload: ChangeCompanyMemberRoleDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.rolesService.changeCompanyMemberRole({
      companyId,
      payload,
      trx
    });
  }
}
