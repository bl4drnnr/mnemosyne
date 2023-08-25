import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-users.model';
import { CreateCompanyUserInterface } from '@interfaces/create-company-user.interface';
import { GetCompanyUserByUserIdInterface } from '@interfaces/get-company-user-by-user-id.interface';
import { ConfirmCompanyMemberInterface } from '@interfaces/confirm-company-member.interface';

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
    companyId,
    userId,
    trx: transaction
  }: CreateCompanyUserInterface) {
    return await this.companyUserRepository.create(
      {
        userId,
        companyId,
        invitationSentAt: new Date()
      },
      { transaction }
    );
  }

  async getCompanyUserByUserId({
    userId,
    trx: transaction
  }: GetCompanyUserByUserIdInterface) {
    return await this.companyUserRepository.findOne({
      where: { userId },
      transaction
    });
  }

  async confirmCompanyMembership({
    userId,
    trx: transaction
  }: ConfirmCompanyMemberInterface) {
    return await this.companyUserRepository.update(
      {
        invitationConfirmed: true
      },
      { where: { userId }, transaction }
    );
  }
}
