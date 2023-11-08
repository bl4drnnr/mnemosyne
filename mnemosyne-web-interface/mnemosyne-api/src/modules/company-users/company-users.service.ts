import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-users.model';
import { CreateCompanyUserInterface } from '@interfaces/create-company-user.interface';
import { GetCompanyUserByUserIdInterface } from '@interfaces/get-company-user-by-user-id.interface';
import { ConfirmCompanyMemberInterface } from '@interfaces/confirm-company-member.interface';
import { InviteUserToCompanyInterface } from '@interfaces/invite-user-to-company.interface';
import { UsersService } from '@modules/users.service';
import { UserInvitedDto } from '@dto/user-invited.dto';
import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { RolesService } from '@modules/roles.service';
import { User } from '@models/user.model';
import { UserInfoInterface } from '@interfaces/user-info.interface';

@Injectable()
export class CompanyUsersService {
  constructor(
    @InjectModel(CompanyUser)
    private readonly companyUserRepository: typeof CompanyUser,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService
  ) {}

  async inviteUserToCompany({
    userId,
    payload,
    trx
  }: InviteUserToCompanyInterface) {
    const { email, role } = payload;

    const {
      company: { id: companyId }
    } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    let createdUser: User;

    const userInfo: UserInfoInterface = {};

    const existingUser = await this.usersService.getUserByEmail({
      email,
      trx
    });

    if (existingUser) {
      await this.rolesService.grantRole({
        value: role,
        userId: existingUser.id,
        trx
      });
    } else {
      createdUser = await this.usersService.createUser({
        payload: { email },
        role,
        trx
      });
    }

    userInfo.email = existingUser ? existingUser.email : email;
    userInfo.firstName = existingUser ? existingUser.firstName : null;
    userInfo.lastName = existingUser ? existingUser.lastName : null;

    const companyUserId = existingUser ? existingUser.id : createdUser.id;

    await this.createCompanyUser({
      userId: companyUserId,
      companyId,
      trx
    });

    const companyMemberRegEmailPayload: VerificationEmailInterface = {
      to: userInfo.email,
      confirmationType: Confirmation.COMPANY_INVITATION,
      userId: companyUserId
    };

    // await this.emailService.sendCompanyMemberEmail({
    //   payload: { ...companyMemberRegEmailPayload },
    //   companyInfo: { ...payload },
    //   isUserExists: !!existingCompanyMember,
    //   userInfo,
    //   language,
    //   trx
    // });

    return new UserInvitedDto();
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
