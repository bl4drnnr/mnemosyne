import { Injectable } from '@nestjs/common';
import { Company } from '@models/company.model';
import { InjectModel } from '@nestjs/sequelize';
import { RegistrationCompanyInterface } from '@interfaces/registration-company.interface';
import { CompanyCreatedDto } from '@dto/company-created.dto';
import { CompanyExistsException } from '@exceptions/company-exists.exception';
import { GetCompanyByNameInterface } from '@interfaces/get-company-by-name.interface';
import { CreateCompanyInterface } from '@interfaces/create-company.interface';
import { UsersService } from '@modules/users.service';
import { EmailService } from '@shared/email.service';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { CryptographicService } from '@shared/cryptographic.service';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';

@Injectable()
export class CompanyService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    @InjectModel(Company)
    private readonly companyRepository: typeof Company
  ) {}

  async createCompany({ payload, trx }: RegistrationCompanyInterface) {
    const { companyName, companyOwnerEmail, companyMembers, language } =
      payload;

    const existingCompany = await this.getCompanyByName({
      companyName,
      trx
    });

    if (existingCompany) throw new CompanyExistsException();

    await this.createCompanyAccount({
      ...payload,
      trx
    });

    let to: string;
    let userId: string;

    const ownerExistingAccount = await this.userService.getUserByEmail({
      email: companyOwnerEmail,
      trx
    });

    if (ownerExistingAccount) {
      to = ownerExistingAccount.email;
      userId = ownerExistingAccount.id;
    } else {
      const createdOwnerAccount = await this.userService.createUser({
        payload: { email: companyOwnerEmail },
        trx
      });
      to = companyOwnerEmail;
      userId = createdOwnerAccount.id;
    }

    for (const companyMember of companyMembers) {
      const userInfo: UserInfoInterface = {};
      // let companyMemberRegEmailPayload: VerificationEmailInterface = {
      //   confirmationHash: "",
      //   confirmationType: undefined,
      //   userId: ""
      // };

      const existingCompanyMember = await this.userService.getUserByEmail({
        email: companyMember.email,
        trx
      });

      if (existingCompanyMember) {
        userInfo.email = existingCompanyMember.email;
        userInfo.firstName = existingCompanyMember.firstName;
        userInfo.lastName = existingCompanyMember.lastName;
      } else {
        userInfo.email = companyMember.email;
      }

      // await this.emailService.sendCompanyMemberEmail({
      //   companyInfo: { ...payload },
      //   payload: {},
      //   userInfo,
      //   language,
      //   trx
      // });
    }

    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const companyRegistrationEmailPayload: VerificationEmailInterface = {
      confirmationType: Confirmation.COMPANY_REGISTRATION,
      confirmationHash,
      userId,
      to
    };

    await this.emailService.sendCompanyRegistrationEmail({
      payload: { ...companyRegistrationEmailPayload },
      companyInfo: { ...payload },
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
    companyOwnerEmail,
    trx: transaction
  }: CreateCompanyInterface) {
    return await this.companyRepository.create(
      {
        companyName,
        companyLocation,
        companyWebsite,
        companyOwnerEmail
      },
      { transaction }
    );
  }
}
