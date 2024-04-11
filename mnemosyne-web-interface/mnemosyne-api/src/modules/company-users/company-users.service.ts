import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-user.model';
import { CreateCompanyUserInterface } from '@interfaces/create-company-user.interface';
import { GetCompanyUserByUserIdInterface } from '@interfaces/get-company-user-by-user-id.interface';
import { ConfirmCompanyMemberInterface } from '@interfaces/confirm-company-member.interface';
import { InviteUserToCompanyInterface } from '@interfaces/invite-user-to-company.interface';
import { UsersService } from '@modules/users.service';
import { UserInvitedDto } from '@dto/user-invited.dto';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { User } from '@models/user.model';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { EmailService } from '@shared/email.service';
import { CompanyService } from '@modules/company.service';
import { GetCompanyMemberInfoInterface } from '@interfaces/get-company-member-info.interface';
import { CompanyMemberNotFoundException } from '@exceptions/company-member-not-found.exception';
import { CompanyMemberInfoDto } from '@dto/company-member-info.dto';
import { UpdateCompanyMemberInfoInterface } from '@interfaces/update-company-member-info.interface';
import { UserUpdatedDto } from '@dto/user-updated.dto';
import { AuthService } from '@modules/auth.service';
import { CompanyMemberDeletedDto } from '@dto/company-member-deleted.dto';
import { DeleteCompanyMemberInterface } from '@interfaces/delete-company-member.interface';
import { SearchCompanyMemberInterface } from '@interfaces/search-company-member.interface';
import { Company } from '@models/company.model';
import { Op } from 'sequelize';
import { SearchCompanyMembersDto } from '@dto/search-company-members.dto';
import { ParseException } from '@exceptions/parse.exception';
import { RolesService } from '@modules/roles.service';
import { RoleDoesntExistException } from '@exceptions/role-doesnt-exist.exception';

@Injectable()
export class CompanyUsersService {
  constructor(
    @InjectModel(CompanyUser)
    private readonly companyUserRepository: typeof CompanyUser,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService
  ) {}

  async inviteUserToCompany({
    userId,
    payload,
    trx
  }: InviteUserToCompanyInterface) {
    const { invitedUsers, language } = payload;

    const {
      company: { id: companyId }
    } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    for (const invitedUser of invitedUsers) {
      let createdUser: User;

      const userInfo: UserInfoInterface = {};

      const existingUser = await this.usersService.getUserByEmail({
        email: invitedUser.email,
        trx
      });

      if (!existingUser) {
        createdUser = await this.usersService.createUser({
          payload: { email: invitedUser.email },
          trx
        });
      }

      userInfo.email = existingUser ? existingUser.email : invitedUser.email;
      userInfo.firstName = existingUser ? existingUser.firstName : null;
      userInfo.lastName = existingUser ? existingUser.lastName : null;

      const companyUserId = existingUser ? existingUser.id : createdUser.id;

      const createCompanyUser = await this.createCompanyUser({
        userId: companyUserId,
        companyId,
        trx
      });

      const companyRole = await this.rolesService.getRoleById({
        id: invitedUser.roleId,
        trx
      });

      if (!companyRole) throw new RoleDoesntExistException();

      await this.rolesService.assignRoleToUser({
        companyId,
        roleId: companyRole.id,
        companyUserId: createCompanyUser.id,
        trx
      });

      const companyMemberRegEmailPayload: VerificationEmailInterface = {
        to: userInfo.email,
        confirmationType: Confirmation.COMPANY_INVITATION,
        userId: companyUserId
      };

      const { companyName, companyLocation, companyWebsite, companyOwnerId } =
        await this.companyService.getCompanyByUserId({
          userId,
          trx
        });

      const companyOwner = await this.usersService.getUserById({
        id: companyOwnerId,
        trx
      });

      const companyInfo = {
        companyName,
        companyLocation,
        companyWebsite,
        companyOwnerEmail: companyOwner.email
      };
      const isUserExists = !!existingUser;

      await this.emailService.sendCompanyMemberEmail({
        payload: { ...companyMemberRegEmailPayload },
        isUserExists,
        companyInfo,
        userInfo,
        language,
        trx
      });
    }

    return new UserInvitedDto();
  }

  async getCompanyMemberInfo({
    companyId,
    memberId: userId,
    trx
  }: GetCompanyMemberInfoInterface) {
    const companyMember = await this.companyUserRepository.findOne({
      where: { companyId, userId },
      include: { model: User },
      transaction: trx
    });

    if (!companyMember) throw new CompanyMemberNotFoundException();

    const companyMemberRole =
      await this.rolesService.getUserRolesByCompanyUserId({
        companyUserId: companyMember.id,
        trx
      });

    const {
      email,
      firstName,
      lastName,
      namePronunciation,
      homeAddress,
      homePhone
    } = companyMember.user;

    return new CompanyMemberInfoDto({
      memberId: companyMember.user.id,
      email,
      firstName,
      lastName,
      namePronunciation,
      homeAddress,
      homePhone,
      companyMemberRole
    });
  }

  async updateCompanyMemberInfo({
    companyId,
    payload,
    memberId: userId,
    trx
  }: UpdateCompanyMemberInfoInterface) {
    const companyMember = await this.companyUserRepository.findOne({
      where: { companyId, userId },
      include: { model: User },
      transaction: trx
    });

    if (!companyMember) throw new CompanyMemberNotFoundException();

    await this.usersService.updateUserInfo({
      userId: companyMember.user.id,
      payload,
      trx
    });

    return new UserUpdatedDto();
  }

  async deleteCompanyMember({
    userId,
    companyId,
    payload,
    memberId,
    trx
  }: DeleteCompanyMemberInterface) {
    const { mfaCode, phoneCode, language } = payload;

    const companyMember = await this.companyUserRepository.findOne({
      where: { companyId, userId: memberId },
      include: { model: User },
      transaction: trx
    });

    if (!companyMember) throw new CompanyMemberNotFoundException();

    const { email: performedByEmail, userSettings } =
      await this.usersService.getUserById({
        id: userId,
        trx
      });

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode,
        phoneCode,
        userSettings,
        userId,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    await this.companyUserRepository.destroy({
      where: { companyId, userId: memberId },
      transaction: trx
    });

    const { companyName } = await this.companyService.getCompanyById({
      id: companyId,
      trx
    });

    await this.emailService.sendDeletionCompanyMemberEmail({
      to: companyMember.user.email,
      performedBy: performedByEmail,
      companyName,
      language
    });

    return new CompanyMemberDeletedDto();
  }

  async searchCompanyMembers({
    companyId,
    query,
    page,
    pageSize,
    trx: transaction
  }: SearchCompanyMemberInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    const users = await this.companyUserRepository.findAll({
      include: [
        {
          model: Company,
          where: { id: companyId }
        },
        {
          model: User,
          where: {
            [Op.or]: [
              { email: { [Op.iLike]: `%${query}%` } },
              { firstName: { [Op.iLike]: `%${query}%` } },
              { lastName: { [Op.iLike]: `%${query}%` } }
            ]
          },
          attributes: ['email']
        }
      ],
      attributes: ['id'],
      limit,
      offset,
      transaction
    });

    const companyMembers = users.map(({ id, user }) => {
      return { email: user.email, companyUserId: id };
    });

    return new SearchCompanyMembersDto(companyMembers);
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
      rejectOnEmpty: undefined,
      where: { userId },
      transaction
    });
  }

  async confirmCompanyMembership({
    userId,
    trx: transaction
  }: ConfirmCompanyMemberInterface) {
    await this.companyUserRepository.update(
      {
        invitationConfirmed: true
      },
      { returning: undefined, where: { userId }, transaction }
    );
  }
}
