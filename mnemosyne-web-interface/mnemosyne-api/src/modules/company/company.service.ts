import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
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
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { CompanyUsersService } from '@modules/company-users.service';
import { Roles } from '@interfaces/roles.enum';
import { ConfirmCompanyAccountInterface } from '@interfaces/confirm-company-account.interface';
import { ConfirmCompanyMembershipInterface } from '@interfaces/confirm-company-membership.interface';
import { CompanyMemberAccConfirmedDto } from '@dto/company-member-acc-confirmed.dto';
import { ConfirmCompanyCreationInterface } from '@interfaces/confirm-company-creation.interface';
import { GetCompanyByUserIdInterface } from '@interfaces/get-company-by-user-id.interface';
import { CompanyAccountConfirmedDto } from '@dto/company-account-confirmed.dto';
import { TacNotAcceptedException } from '@exceptions/tac-not-accepted.exception';
import { RolesService } from '@modules/roles.service';
import { User } from '@models/user.model';
import { GetCompanyInfoByIdInterface } from '@interfaces/get-company-info-by-id.interface';
import { GetCompanyByIdDto } from '@dto/get-company-by-id.dto';
import { ParseException } from '@exceptions/parse.exception';
import { DeleteCompanyAccountInterface } from '@interfaces/delete-company-account.interface';
import { UpdateCompanyInfoInterface } from '@interfaces/update-company-info.interface';
import { CompanyUpdatedDto } from '@dto/company-updated.dto';
import { GetCompanyUsersInterface } from '@interfaces/get-company-users.interface';
import { GetCompanyUsersDto } from '@dto/get-company-users.dto';
import { TransferOwnershipInterface } from '@interfaces/transfer-ownership.interface';
import { CompanyOwnershipTransferredDto } from '@dto/company-ownership-transferred.dto';
import { AuthService } from '@modules/auth.service';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
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
      tac,
      language
    } = payload;

    if (!tac) throw new TacNotAcceptedException();

    const existingCompany = await this.getCompanyByName({
      companyName,
      trx
    });

    if (existingCompany) throw new CompanyExistsException();

    let createdOwnerAccount: User;

    const ownerExistingAccount = await this.usersService.getUserByEmail({
      email: companyOwnerEmail,
      trx
    });

    if (ownerExistingAccount) {
      await this.rolesService.grantRole({
        value: Roles.PRIMARY_ADMIN,
        userId: ownerExistingAccount.id,
        trx
      });
    } else {
      createdOwnerAccount = await this.usersService.createUser({
        payload: { email: companyOwnerEmail, tac: true },
        trx
      });
      await this.rolesService.grantRole({
        userId: createdOwnerAccount.id,
        value: Roles.PRIMARY_ADMIN,
        trx
      });
    }

    const to = ownerExistingAccount
      ? ownerExistingAccount.email
      : companyOwnerEmail;

    const userId = ownerExistingAccount
      ? ownerExistingAccount.id
      : createdOwnerAccount.id;

    const companyCreationPayload: CreateCompanyInterface = {
      companyName,
      companyLocation,
      companyWebsite,
      companyOwnerId: userId,
      tac,
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
      let createdUser: User;

      const userInfo: UserInfoInterface = {};

      const existingCompanyMember = await this.usersService.getUserByEmail({
        email: companyMember.email,
        trx
      });

      if (existingCompanyMember) {
        await this.rolesService.grantRole({
          value: companyMember.role,
          userId: existingCompanyMember.id,
          trx
        });
      } else {
        createdUser = await this.usersService.createUser({
          payload: { email: companyMember.email },
          trx
        });
        await this.rolesService.grantRole({
          userId: createdUser.id,
          value: companyMember.role,
          trx
        });
      }

      userInfo.email = existingCompanyMember
        ? existingCompanyMember.email
        : companyMember.email;
      userInfo.firstName = existingCompanyMember
        ? existingCompanyMember.firstName
        : null;
      userInfo.lastName = existingCompanyMember
        ? existingCompanyMember.lastName
        : null;

      const userId = existingCompanyMember
        ? existingCompanyMember.id
        : createdUser.id;

      await this.companyUsersService.createCompanyUser({
        userId,
        companyId,
        trx
      });

      const companyMemberRegEmailPayload: VerificationEmailInterface = {
        to: userInfo.email,
        confirmationType: Confirmation.COMPANY_INVITATION,
        userId
      };

      const isUserExists = !!existingCompanyMember;

      await this.emailService.sendCompanyMemberEmail({
        payload: { ...companyMemberRegEmailPayload },
        companyInfo: { ...payload },
        isUserExists,
        userInfo,
        language,
        trx
      });
    }

    const companyRegistrationEmailPayload: VerificationEmailInterface = {
      confirmationType: Confirmation.COMPANY_REGISTRATION,
      userId,
      to
    };

    const isUserExists = !!ownerExistingAccount;

    await this.emailService.sendCompanyRegistrationEmail({
      payload: { ...companyRegistrationEmailPayload },
      companyInfo: { ...payload },
      isUserExists,
      language,
      trx
    });

    return new CompanyCreatedDto();
  }

  async getCompanyInformationById({
    companyId,
    trx: transaction
  }: GetCompanyInfoByIdInterface) {
    const company = await this.companyRepository.findByPk(companyId, {
      transaction,
      include: { all: true }
    });

    const { companyName, companyLocation, companyWebsite, companyOwnerId } =
      company;

    const { email: companyOwnerEmail } = await this.usersService.getUserById({
      id: companyOwnerId,
      trx: transaction
    });

    return new GetCompanyByIdDto({
      companyName,
      companyLocation,
      companyWebsite,
      companyOwnerId,
      companyOwnerEmail
    });
  }

  async getCompanyUsers({
    companyId,
    page,
    pageSize,
    trx: transaction
  }: GetCompanyUsersInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    const { companyUsers } = await this.companyRepository.findByPk(companyId, {
      transaction,
      include: { all: true }
    });

    const companyUsersIds = companyUsers.map(
      (companyUser) => companyUser.userId
    );

    const { rows, count } = await this.usersService.getUsersByIds({
      offset,
      limit,
      ids: companyUsersIds,
      attributes: ['id', 'email'],
      trx: transaction
    });

    const users = rows.map(({ id, email, roles, confirmationHashes }) => {
      const registrationHash = confirmationHashes[0];
      const userRoles = roles.map(({ id, value }) => {
        return { id, value };
      });

      return {
        id,
        email,
        roles: userRoles,
        registrationHash: {
          confirmed: registrationHash.confirmed,
          createdAt: registrationHash.createdAt
        }
      };
    });

    return new GetCompanyUsersDto({
      companyUsers: users,
      count
    });
  }

  async getCompanyByName({
    companyName,
    trx: transaction
  }: GetCompanyByNameInterface) {
    return await this.companyRepository.findOne({
      rejectOnEmpty: undefined,
      where: { companyName },
      transaction
    });
  }

  async getCompanyByUserId({ userId, trx }: GetCompanyByUserIdInterface) {
    const companyUser = await this.companyUsersService.getCompanyUserByUserId({
      userId,
      trx
    });

    if (!companyUser) return null;

    return await this.companyRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: companyUser.companyId },
      include: { all: true },
      transaction: trx
    });
  }

  async confirmCompanyAccount({
    companyId: id,
    trx: transaction
  }: ConfirmCompanyAccountInterface) {
    await this.companyRepository.update(
      {
        isConfirmed: true
      },
      { returning: undefined, where: { id }, transaction }
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
    const { companyName } = await this.getCompanyByUserId({
      userId,
      trx
    });

    const { email } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    await this.companyUsersService.confirmCompanyMembership({ userId, trx });

    await this.emailService.sendCompanyMemberConfirmCompleteEmail({
      to: email,
      companyName,
      language
    });

    return new CompanyMemberAccConfirmedDto();
  }

  deleteCompanyAccount({
    userId,
    payload,
    trx
  }: DeleteCompanyAccountInterface) {
    const { language } = payload;
  }

  async updateCompanyInformation({
    companyId,
    payload,
    trx
  }: UpdateCompanyInfoInterface) {
    await this.companyRepository.update(
      {
        ...payload
      },
      { returning: undefined, where: { id: companyId }, transaction: trx }
    );

    return new CompanyUpdatedDto();
  }

  async transferCompanyOwnership({
    companyId,
    userId,
    payload,
    trx
  }: TransferOwnershipInterface) {
    const { mfaCode, phoneCode, language, newCompanyOwnerEmail } = payload;

    const { userSettings } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        userSettings,
        userId,
        mfaCode,
        phoneCode,
        language,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    return new CompanyOwnershipTransferredDto();
  }

  private async createCompanyAccount({
    companyName,
    companyLocation,
    companyWebsite,
    companyOwnerId,
    tac,
    trx: transaction
  }: CreateCompanyInterface) {
    return await this.companyRepository.create(
      {
        companyName,
        companyLocation,
        companyWebsite,
        companyOwnerId,
        tac
      },
      { transaction }
    );
  }
}
