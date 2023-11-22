import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CompanyUsersService } from '@modules/company-users.service';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { RoleGuard } from '@guards/role.guard';
import { UserId } from '@decorators/user-id.decorator';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { Roles } from '@decorators/roles.decorator';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { CompanyUsersDocs } from '@docs/company-users.docs';

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
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('invite-user')
  inviteUser(
    @UserId() userId: string,
    @Body() payload: InviteUserToCompanyDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.companyUsersService.inviteUserToCompany({
      userId,
      payload,
      trx
    });
  }
}
