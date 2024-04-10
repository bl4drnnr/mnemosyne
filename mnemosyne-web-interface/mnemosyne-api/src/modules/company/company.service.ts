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
import { UpdateCompanyInfoInterface } from '@interfaces/update-company-info.interface';
import { CompanyUpdatedDto } from '@dto/company-updated.dto';
import { GetCompanyUsersInterface } from '@interfaces/get-company-users.interface';
import { GetCompanyUsersDto } from '@dto/get-company-users.dto';
import { TransferOwnershipInterface } from '@interfaces/transfer-ownership.interface';
import { CompanyOwnershipTransferredDto } from '@dto/company-ownership-transferred.dto';
import { AuthService } from '@modules/auth.service';
import { GetCompanyByIdInterface } from '@interfaces/get-company-by-id.interface';
import { DeleteCompanyInterface } from '@interfaces/delete-company.interface';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { CryptographicService } from '@shared/cryptographic.service';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';
import { CompanyDeletedDto } from '@dto/company-deleted.dto';
import { CompanyUser } from '@models/company-user.model';
import { CompanyUserType } from '@custom-types/company-user.type';
import { UserNotFoundException } from '@exceptions/user-not-found.exception';
import { RoleDoesntExistException } from '@exceptions/role-doesnt-exist.exception';
import { Op } from 'sequelize';
import { GetCompanyUserRolesInterface } from '@interfaces/get-company-user-roles.interface';
import { CompanyNotFoundException } from '@exceptions/company-not-found.exception';
import { GetCompanyPublicInformationInterface } from '@interfaces/get-company-public-information.interface';
import { GetCompanyPublicInfoDto } from '@dto/get-company-public-info.dto';
import { GetAllCompanyUsersInterface } from '@interfaces/get-all-company-users.interface';

@Injectable()
export class CompanyService {
  constructor(
    private readonly cryptographicService: CryptographicService,
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

    if (!ownerExistingAccount) {
      createdOwnerAccount = await this.usersService.createUser({
        payload: { email: companyOwnerEmail, tac: true },
        trx
      });
    }

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

    const { id: companyUserId } =
      await this.companyUsersService.createCompanyUser({
        userId,
        companyId,
        trx
      });

    await this.rolesService.grantInitRole({
      role: Roles.PRIMARY_ADMIN,
      companyUserId,
      companyId,
      trx
    });

    const to = ownerExistingAccount
      ? ownerExistingAccount.email
      : companyOwnerEmail;

    for (const companyMember of companyMembers) {
      let createdUser: User;

      const userInfo: UserInfoInterface = {};

      const existingCompanyMember = await this.usersService.getUserByEmail({
        email: companyMember.email,
        trx
      });

      if (!existingCompanyMember) {
        createdUser = await this.usersService.createUser({
          payload: { email: companyMember.email },
          trx
        });
      }

      const userId = existingCompanyMember
        ? existingCompanyMember.id
        : createdUser.id;

      const { id: companyUserId } =
        await this.companyUsersService.createCompanyUser({
          userId,
          companyId,
          trx
        });

      await this.rolesService.grantInitRole({
        role: companyMember.role,
        companyUserId,
        companyId,
        trx
      });

      userInfo.email = existingCompanyMember
        ? existingCompanyMember.email
        : companyMember.email;
      userInfo.firstName = existingCompanyMember
        ? existingCompanyMember.firstName
        : null;
      userInfo.lastName = existingCompanyMember
        ? existingCompanyMember.lastName
        : null;

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

  async getCompanyPublicInformation({
    companyId,
    page,
    pageSize,
    query,
    trx: transaction
  }: GetCompanyPublicInformationInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    const company = await this.companyRepository.findByPk(companyId, {
      transaction,
      include: { all: true }
    });

    if (!company) throw new CompanyNotFoundException();

    const {
      companyName,
      companyLocation,
      companyUsers,
      companyWebsite,
      companyOwnerId
    } = company;

    const companyUsersIds = companyUsers.map(({ userId }) => userId);
    const quantityOfUsers = companyUsers.length;

    const where = {};

    if (query) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${query}%` } },
        { lastName: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const { count, rows } = await this.usersService.getUsersByIds({
      offset,
      limit,
      where,
      ids: companyUsersIds,
      attributes: ['id', 'firstName', 'lastName'],
      trx: transaction
    });

    const companyMembers = rows.map(({ id, firstName, lastName }) => {
      return { id, firstName, lastName };
    });

    const { firstName: companyOwnerFirstName, lastName: companyOwnerLastName } =
      await this.usersService.getUserById({
        id: companyOwnerId,
        trx: transaction
      });

    return new GetCompanyPublicInfoDto({
      count,
      quantityOfUsers,
      companyOwnerId,
      companyOwnerFirstName,
      companyOwnerLastName,
      companyName,
      companyLocation,
      companyWebsite,
      companyMembers
    });
  }

  async getCompanyUsers({
    companyId,
    page,
    pageSize,
    query,
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

    const where = {};

    if (query) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${query}%` } },
        { firstName: { [Op.iLike]: `%${query}%` } },
        { lastName: { [Op.iLike]: `%${query}%` } },
        { namePronunciation: { [Op.iLike]: `%${query}%` } },
        { homeAddress: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const { rows, count } = await this.usersService.getUsersByIds({
      offset,
      limit,
      where,
      ids: companyUsersIds,
      attributes: ['id', 'email'],
      trx: transaction
    });

    const users: Array<CompanyUserType> = [];

    for (const { id, email, companyUser, confirmationHashes } of rows) {
      const registrationHash = confirmationHashes[0];

      const payload: CompanyUserType = {
        id,
        email,
        registrationHash: {
          confirmed: registrationHash.confirmed,
          createdAt: registrationHash.createdAt
        }
      };

      if (companyUser) {
        payload.role = await this.rolesService.getUserRolesByCompanyUserId({
          companyUserId: companyUser.id,
          trx: transaction
        });
      }

      users.push(payload);
    }

    return new GetCompanyUsersDto({
      companyUsers: users,
      count
    });
  }

  async getAllCompanyUsers({ companyId, trx }: GetAllCompanyUsersInterface) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      include: { all: true },
      transaction: trx
    });

    if (!company) throw new CompanyNotFoundException();

    const companyUsersIds = company.companyUsers.map(({ userId }) => userId);

    return await this.usersService.getUsersByIds({
      attributes: ['id', 'email', 'firstName', 'lastName'],
      ids: companyUsersIds,
      trx
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

  async getCompanyById({ id, trx: transaction }: GetCompanyByIdInterface) {
    return await this.companyRepository.findByPk(id, {
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
    const {
      mfaCode,
      phoneCode,
      language,
      newCompanyOwnerEmail,
      newRoleForOldOwnerId
    } = payload;

    const { userSettings } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    const newCompanyOwner = await this.usersService.getUserByEmail({
      email: newCompanyOwnerEmail,
      trx
    });

    if (!newCompanyOwner) throw new UserNotFoundException();

    const newCompanyOwnerCompanyUser =
      await this.companyUsersService.getCompanyUserByUserId({
        userId: newCompanyOwner.id
      });

    if (
      !newCompanyOwnerCompanyUser ||
      newCompanyOwnerCompanyUser.companyId !== companyId
    )
      throw new UserNotFoundException();

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

    const { companyRoles } = await this.rolesService.getCompanyRoles({
      companyId,
      trx
    });

    const primaryRole = companyRoles.find(
      ({ name }) => name === Roles.PRIMARY_ADMIN
    );

    const newRoleForOldOwner = await this.rolesService.getRoleById({
      id: newRoleForOldOwnerId,
      trx
    });

    if (!newRoleForOldOwner) throw new RoleDoesntExistException();

    const oldCompanyOwnerCompanyUser =
      await this.companyUsersService.getCompanyUserByUserId({
        userId,
        trx
      });

    await this.rolesService.updateUserRole({
      companyUserId: newCompanyOwnerCompanyUser.id,
      companyId,
      newRoleId: primaryRole.id,
      trx
    });

    await this.rolesService.updateUserRole({
      companyUserId: oldCompanyOwnerCompanyUser.id,
      companyId,
      newRoleId: newRoleForOldOwner.id,
      trx
    });

    return new CompanyOwnershipTransferredDto();
  }

  async deleteCompanyAccount({
    companyId,
    userId,
    payload,
    trx
  }: DeleteCompanyInterface) {
    const { mfaCode, phoneCode, language, recoveryKeys, passphrase, password } =
      payload;

    const { email, userSettings } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    const { email: performedByEmail } =
      await this.usersService.verifyUserCredentials({
        email,
        password,
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

    const hashedPassphrase = this.cryptographicService.hashPassphrase({
      passphrase
    });

    const encryptedRecoveryKeys = this.cryptographicService.encryptRecoveryKeys(
      {
        recoveryKeys,
        hashedPassphrase
      }
    );

    const recoveryKeysFingerprint = this.cryptographicService.hash({
      data: encryptedRecoveryKeys,
      algorithm: CryptoHashAlgorithm.SHA512
    });

    if (userSettings.recoveryKeysFingerprint !== recoveryKeysFingerprint)
      throw new WrongRecoveryKeysException();

    const { companyName, companyUsers } = await this.companyRepository.findByPk(
      companyId,
      {
        transaction: trx,
        include: [
          {
            model: CompanyUser,
            include: [{ model: User }]
          }
        ]
      }
    );

    for (const companyUser of companyUsers) {
      await this.emailService.sendDeletionCompanyEmail({
        to: companyUser.user.email,
        performedBy: performedByEmail,
        companyName,
        language
      });
    }

    // @TODO Refactor this part of code once the database is rebuilt
    // Basically, it means, check if the deletion process is the cascade one
    await this.companyRepository.destroy({
      where: { id: companyId },
      transaction: trx
    });

    return new CompanyDeletedDto();
  }

  async getCompanyUserRole({
    companyUserId,
    trx
  }: GetCompanyUserRolesInterface) {
    return await this.rolesService.getUserRolesByCompanyUserId({
      companyUserId,
      trx
    });
  }

  async createCompanyAccount({
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
