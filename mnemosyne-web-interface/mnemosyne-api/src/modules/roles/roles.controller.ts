import { Controller } from '@nestjs/common';
import { RolesService } from '@modules/roles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
}
