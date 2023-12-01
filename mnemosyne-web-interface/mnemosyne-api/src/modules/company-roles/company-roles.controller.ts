import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { CompanyRolesService } from '@modules/company-roles.service';
import { CompanyId } from '@decorators/company-id.decorator';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CreateCompanyRoleDto } from '@dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';
import { AssignRoleDto } from '@dto/assign-role.dto';
import { RevokeRoleDto } from '@dto/revoke-role.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '@pipes/validation.pipe';
import { Roles } from '@decorators/roles.decorator';
import { RoleGuard } from '@guards/role.guard';
import { AuthGuard } from '@guards/auth.guard';

@ApiTags('Company Roles')
@Controller('company-roles')
export class CompanyRolesController {
  constructor(private readonly companyRolesService: CompanyRolesService) {}

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('create-role')
  createCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: CreateCompanyRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyRolesService.createCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('update-role')
  updateCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: UpdateCompanyRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyRolesService.updateCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete('delete-role')
  deleteCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: any,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyRolesService.deleteCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('assign-role')
  assignRoleToUser(
    @CompanyId() companyId: string,
    @Body() payload: AssignRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyRolesService.assignRoleToUser({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('revoke-role')
  revokeUserRole(
    @CompanyId() companyId: string,
    @Body() payload: RevokeRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyRolesService.revokeUserRole({
      companyId,
      payload,
      trx
    });
  }
}
