import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-users.model';

@Injectable()
export class CompanyUsersService {
  constructor(
    @InjectModel(CompanyUser)
    private readonly companyUserRepository: typeof CompanyUser
  ) {}

  async inviteUserToCompany() {}
}
