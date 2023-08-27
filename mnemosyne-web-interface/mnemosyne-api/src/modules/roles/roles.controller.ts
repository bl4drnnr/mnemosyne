import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { RolesService } from '@modules/roles.service';
import { CreateRoleDto } from '@dto/create-role.dto';
import { GrantRoleDto } from '@dto/grant-role.dto';
import { RevokeRoleDto } from '@dto/revoke-role.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UsePipes(ValidationPipe)
  @Post()
  createRole(@Body() payload: CreateRoleDto) {
    return this.rolesService.createRole(payload);
  }

  @Get(':value')
  getRoleByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }

  @UsePipes(ValidationPipe)
  @Post('grant')
  grantRole(@Body() payload: GrantRoleDto) {
    return this.rolesService.grantRole(payload);
  }

  @UsePipes(ValidationPipe)
  @Post('revoke')
  revokeRole(@Body() payload: RevokeRoleDto) {
    return this.rolesService.revokeRole(payload);
  }
}
