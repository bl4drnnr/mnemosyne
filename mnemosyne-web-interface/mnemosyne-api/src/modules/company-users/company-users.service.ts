import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-users.model';
import { CreateCompanyUserInterface } from '@interfaces/create-company-user.interface';
import { Roles } from '@interfaces/roles.enum';

@Injectable()
export class CompanyUsersService {
  constructor(
    @InjectModel(CompanyUser)
    private readonly companyUserRepository: typeof CompanyUser
  ) {}

  async inviteUserToCompany() {
    //
  }

  async createCompanyUser({
    userId,
    companyId,
    role = Roles.DEFAULT
  }: CreateCompanyUserInterface) {
    return await this.companyUserRepository.create({
      userId,
      companyId,
      invitationSentAt: new Date()
    });
  }

  async createCompanyOwner({ userId, companyId }: CreateCompanyUserInterface) {
    return await this.companyUserRepository.create({
      userId,
      companyId,
      invitationSentAt: new Date()
    });
  }
}
