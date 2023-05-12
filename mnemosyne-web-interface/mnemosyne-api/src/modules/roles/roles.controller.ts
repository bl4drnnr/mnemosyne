import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from '@modules/roles.service';
import { CreateRoleDto } from '@dto/create-role.dto';
import { GrantRoleDto } from '@dto/grant-role.dto';
import { RevokeRoleDto } from '@dto/revoke-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  createRole(@Body() payload: CreateRoleDto) {
    return this.rolesService.createRole(payload);
  }

  @Get(':value')
  getRoleByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }

  @Post('grant')
  grantRole(@Body() payload: GrantRoleDto) {
    return this.rolesService.grantRole(payload);
  }

  @Post('revoke')
  revokeRole(@Body() payload: RevokeRoleDto) {
    return this.rolesService.revokeRole(payload);
  }
}
