import { Controller } from '@nestjs/common';
import { UsersService } from '@modules/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
