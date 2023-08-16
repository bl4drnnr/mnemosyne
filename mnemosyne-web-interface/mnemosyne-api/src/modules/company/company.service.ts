import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { Company } from '@models/company.model';
import { InjectModel } from '@nestjs/sequelize';
import { RegistrationCompanyInterface } from '@interfaces/registration-company.interface';
import { CompanyCreatedDto } from '@dto/company-created.dto';
import { CompanyAlreadyExistsException } from '@exceptions/company-already-exists.exception';
import { GetCompanyByNameInterface } from '@interfaces/get-company-by-name.interface';
import { CreateCompanyInterface } from '@interfaces/create-company.interface';
import { UsersService } from '@modules/users.service';
import { EmailService } from '@shared/email.service';
import { Confirmation } from '@interfaces/confirmation-type.enum';

@Injectable()
export class CompanyService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    @InjectModel(Company)
    private readonly companyRepository: typeof Company
  ) {}

  async createCompany({ payload, trx }: RegistrationCompanyInterface) {
    const {
      companyName,
      companyLocation,
      companyWebsite,
      accountOwnerEmail,
      companyMembers,
      language
    } = payload;

    const existingCompany = await this.getCompanyByName({
      companyName,
      trx
    });

    if (existingCompany) throw new CompanyAlreadyExistsException();

    await this.createCompanyAccount({
      ...payload,
      trx
    });

    const confirmationHash = crypto.randomBytes(20).toString('hex');

    const existingUser = await this.userService.getUserByEmail({
      email: accountOwnerEmail,
      trx
    });

    if (companyMembers.length) {
      for (const companyMember in companyMembers) {
        //
      }
    }

    await this.emailService.sendCompanyRegistrationEmail({
      payload: {
        to: existingUser.email,
        confirmationType: Confirmation.COMPANY_REGISTRATION,
        confirmationHash,
        userId: existingUser.id
      },
      companyInfo: {
        companyName,
        companyLocation,
        companyWebsite,
        accountOwnerEmail
      },
      language,
      trx
    });

    return new CompanyCreatedDto();
  }

  async getCompanyByName({
    companyName,
    trx: transaction
  }: GetCompanyByNameInterface) {
    return await this.companyRepository.findOne({
      where: { companyName },
      transaction
    });
  }

  private async createCompanyAccount({
    companyName,
    companyLocation,
    companyWebsite,
    accountOwnerEmail,
    trx: transaction
  }: CreateCompanyInterface) {
    return await this.companyRepository.create(
      {
        companyName,
        companyLocation,
        companyWebsite,
        accountOwnerEmail
      },
      { transaction }
    );
  }
}
