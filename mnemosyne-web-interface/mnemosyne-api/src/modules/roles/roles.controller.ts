import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { RolesService } from '@modules/roles.service';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '@pipes/validation.pipe';
import { Roles } from '@decorators/roles.decorator';
import { RoleGuard } from '@guards/role.guard';
import { AuthGuard } from '@guards/auth.guard';
import { CompanyId } from '@decorators/company-id.decorator';
import { CreateCompanyRoleDto } from '@dto/create-company-role.dto';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';
import { DeleteCompanyRoleDto } from '@dto/delete-company-role.dto';
import { AssignRoleDto } from '@dto/assign-role.dto';
import { RevokeRoleDto } from '@dto/revoke-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('create-role')
  createCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: CreateCompanyRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.rolesService.createCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('update-role')
  updateCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: UpdateCompanyRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.rolesService.updateCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete('delete-role')
  deleteCompanyRole(
    @CompanyId() companyId: string,
    @Body() payload: DeleteCompanyRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.rolesService.deleteCompanyRole({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('assign-role')
  assignRoleToUser(
    @CompanyId() companyId: string,
    @Body() payload: AssignRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.rolesService.assignRoleToUser({
      companyId,
      payload,
      trx
    });
  }

  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'PRIMARY_ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch('revoke-role')
  revokeUserRole(
    @CompanyId() companyId: string,
    @Body() payload: RevokeRoleDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.rolesService.revokeUserRole({
      companyId,
      payload,
      trx
    });
  }
}
