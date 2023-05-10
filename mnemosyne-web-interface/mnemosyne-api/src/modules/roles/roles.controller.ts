import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from '@modules/roles.service';
import { CreateRoleDto } from '@dto/create-role.dto';

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
}
