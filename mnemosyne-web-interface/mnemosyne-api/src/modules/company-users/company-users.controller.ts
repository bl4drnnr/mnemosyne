import { Controller, Post } from '@nestjs/common';
import { CompanyUsersService } from '@modules/company-users.service';

@Controller('company-users')
export class CompanyUsersController {
  constructor(private readonly companyUsersService: CompanyUsersService) {}

  @Post('invite-user')
  inviteUser() {
    return this.companyUsersService.inviteUserToCompany();
  }
}
