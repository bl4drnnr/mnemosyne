import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { GetCompanyByOwnerIdInterface } from '@interfaces/get-company-by-owner-id.interface';

@Injectable()
export class CompanyService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectModel(Company)
    private readonly companyRepository: typeof Company
  ) {}

  async createCompany({ payload, trx }: RegistrationCompanyInterface) {
    const {
      companyName,
      companyOwnerEmail,
      companyWebsite,
      companyLocation,
      companyMembers,
      language
    } = payload;

    const existingCompany = await this.getCompanyByName({
      companyName,
      trx
    });

    if (existingCompany) throw new CompanyExistsException();

    let to: string;
    let userId: string;

    const ownerExistingAccount = await this.usersService.getUserByEmail({
      email: companyOwnerEmail,
      trx
    });

    if (ownerExistingAccount) {
      to = ownerExistingAccount.email;
      userId = ownerExistingAccount.id;
    } else {
      const createdOwnerAccount = await this.usersService.createUser({
        payload: { email: companyOwnerEmail },
        trx
      });
      to = companyOwnerEmail;
      userId = createdOwnerAccount.id;
    }

    const companyCreationPayload = {
      companyName,
      companyLocation,
      companyWebsite,
      companyOwnerId: userId,
      trx
    };

    const { id: companyId } = await this.createCompanyAccount({
      ...companyCreationPayload
    });

    // await this.companyUserRepository.create({
    //   userId,
    //   companyId,
    //   invitationSentAt: new Date()
    // });

    for (const companyMember of companyMembers) {
      let userId: string;
      const userInfo: UserInfoInterface = {};

      const existingCompanyMember = await this.usersService.getUserByEmail({
        email: companyMember.email,
        trx
      });

      if (existingCompanyMember) {
        const { email, firstName, lastName, id } = existingCompanyMember;
        userInfo.email = email;
        userInfo.firstName = firstName;
        userInfo.lastName = lastName;
        userId = id;
      } else {
        const { id } = await this.usersService.createUser({
          payload: { email: companyMember.email },
          trx
        });
        userInfo.email = companyMember.email;
        userId = id;
      }

      const confirmationHash =
        this.cryptographicService.generateConfirmationHash();
      const companyMemberRegEmailPayload: VerificationEmailInterface = {
        confirmationType: Confirmation.COMPANY_INVITATION,
        confirmationHash,
        userId
      };

      await this.emailService.sendCompanyMemberEmail({
        companyInfo: payload,
        payload: companyMemberRegEmailPayload,
        userInfo,
        language,
        trx
      });
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

  async getCompanyByOwnerId({
    companyOwnerId,
    trx: transaction
  }: GetCompanyByOwnerIdInterface) {
    return await this.companyRepository.findOne({
      where: { companyOwnerId },
      transaction
    });
  }

  private async createCompanyAccount({
    companyName,
    companyLocation,
    companyWebsite,
    companyOwnerId,
    trx: transaction
  }: CreateCompanyInterface) {
    return await this.companyRepository.create(
      {
        companyName,
        companyLocation,
        companyWebsite,
        companyOwnerId
      },
      { transaction }
    );
  }
}
