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
import { CompanyUsersService } from '@modules/company-users.service';
import { Roles } from '@interfaces/roles.enum';
import { ConfirmCompanyAccountInterface } from '@interfaces/confirm-company-account.interface';
import { ConfirmCompanyMembershipInterface } from '@interfaces/confirm-company-membership.interface';
import { CompanyMemberAccConfirmedDto } from '@dto/company-member-acc-confirmed.dto';
import { ConfirmCompanyCreationInterface } from '@interfaces/confirm-company-creation.interface';
import { GetCompanyByUserIdInterface } from '@interfaces/get-company-by-user-id.interface';
import { CompanyAccountConfirmedDto } from '@dto/company-account-confirmed.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    @Inject(forwardRef(() => CompanyUsersService))
    private readonly companyUsersService: CompanyUsersService,
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
        role: Roles.PRIMARY_ADMIN,
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

    await this.companyUsersService.createCompanyUser({
      userId,
      companyId,
      trx
    });

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
          role: companyMember.role,
          trx
        });
        userInfo.email = companyMember.email;
        userId = id;
      }

      await this.companyUsersService.createCompanyUser({
        userId,
        companyId,
        trx
      });

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

  async getCompanyByUserId({ userId, trx }: GetCompanyByUserIdInterface) {
    const { companyId } = await this.companyUsersService.getCompanyUserByUserId(
      {
        userId,
        trx
      }
    );
    return await this.companyRepository.findOne({
      where: { id: companyId },
      include: [{ all: true }],
      transaction: trx
    });
  }

  async confirmCompanyAccount({
    companyId: id,
    trx: transaction
  }: ConfirmCompanyAccountInterface) {
    return await this.companyRepository.update(
      {
        isConfirmed: true
      },
      { where: { id }, transaction }
    );
  }

  async confirmCompanyCreation({
    userId,
    language,
    trx
  }: ConfirmCompanyCreationInterface) {
    const {
      id: companyId,
      companyName,
      companyLocation,
      companyWebsite,
      isConfirmed,
      user: { email: companyOwnerEmail }
    } = await this.getCompanyByUserId({
      userId,
      trx
    });

    const companyInfo = {
      companyName,
      companyLocation,
      companyWebsite,
      companyOwnerEmail
    };

    if (!isConfirmed) {
      await this.confirmCompanyAccount({
        companyId,
        trx
      });

      await this.confirmCompanyMembership({
        userId,
        language,
        trx
      });

      await this.emailService.sendCompanyRegistrationCompleteEmail({
        to: companyOwnerEmail,
        companyInfo,
        language
      });
    }

    return new CompanyAccountConfirmedDto();
  }

  async confirmCompanyMembership({
    userId,
    language,
    trx
  }: ConfirmCompanyMembershipInterface) {
    const { email } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    await this.companyUsersService.confirmCompanyMembership({ userId, trx });

    await this.emailService.sendCompanyMemberConfirmCompleteEmail({
      to: email,
      language
    });

    return new CompanyMemberAccConfirmedDto();
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
