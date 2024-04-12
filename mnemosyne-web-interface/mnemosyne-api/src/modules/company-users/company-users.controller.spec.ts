import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from '@modules/company-users.service';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { Language } from '@interfaces/language.enum';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { DeleteCompanyMemberDto } from '@dto/delete-company-member.dto';

dotenv.config({ path: '.env.test' });

describe('CompanyUsersController', () => {
  let controller: CompanyUsersController;
  let companyUsersService: CompanyUsersService;

  const mockCompanyUsersService = {
    inviteUserToCompany: jest.fn().mockImplementation(() => {
      return;
    }),
    getCompanyMemberInfo: jest.fn().mockImplementation(() => {
      return;
    }),
    updateCompanyMemberInfo: jest.fn().mockImplementation(() => {
      return;
    }),
    deleteCompanyMember: jest.fn().mockImplementation(() => {
      return;
    }),
    searchCompanyMembers: jest.fn().mockImplementation(() => {
      return;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyUsersController],
      providers: [
        { provide: CompanyUsersService, useValue: mockCompanyUsersService }
      ]
    })
      .overrideProvider(CompanyUsersService)
      .useValue(mockCompanyUsersService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CompanyUsersController>(CompanyUsersController);
    companyUsersService = module.get<CompanyUsersService>(CompanyUsersService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Invite User', () => {
    it('Should call inviteUserToCompany method with correct parameters', async () => {
      const userId = 'user-id';
      const payload: InviteUserToCompanyDto = {
        invitedUsers: [{ email: 'test2@test.com', roleId: 'role-id' }],
        language: Language.PL
      };
      const trx: any = {};

      await controller.inviteUser(userId, payload, trx);

      expect(companyUsersService.inviteUserToCompany).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('Get Company Member Info', () => {
    it('Should call getCompanyMemberInfo method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const memberId = 'member-id';
      const trx: any = {};

      await controller.getCompanyMemberInfo(companyId, memberId, trx);

      expect(companyUsersService.getCompanyMemberInfo).toHaveBeenCalledWith({
        companyId,
        memberId,
        trx
      });
    }, 20000);
  });

  describe('Update Company Member Info', () => {
    it('Should call updateCompanyMemberInfo method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: UpdateUserInfoDto = {
        firstName: '',
        lastName: '',
        namePronunciation: '',
        homeAddress: '',
        homePhone: ''
      };
      const memberId = 'member-id';
      const trx: any = {};

      await controller.updateCompanyMemberInfo(
        companyId,
        payload,
        memberId,
        trx
      );

      expect(companyUsersService.updateCompanyMemberInfo).toHaveBeenCalledWith({
        companyId,
        payload,
        memberId,
        trx
      });
    }, 20000);
  });

  describe('Delete Company Member', () => {
    it('Should call deleteCompanyMember method with correct parameters', async () => {
      const userId = 'user-id';
      const companyId = 'test-company-id';
      const payload: DeleteCompanyMemberDto = {
        phoneCode: '123123',
        mfaCode: '123123',
        language: Language.PL
      };
      const memberId = 'member-id';
      const trx: any = {};

      await controller.deleteCompanyMember(
        userId,
        companyId,
        payload,
        memberId,
        trx
      );

      expect(companyUsersService.deleteCompanyMember).toHaveBeenCalledWith({
        userId,
        companyId,
        payload,
        memberId,
        trx
      });
    }, 20000);
  });

  describe('Search Company Members', () => {
    it('Should call searchCompanyMembers method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const query = 'test';
      const page = '0';
      const pageSize = '5';
      const trx: any = {};

      await controller.searchCompanyMembers(
        companyId,
        query,
        page,
        pageSize,
        trx
      );

      expect(companyUsersService.searchCompanyMembers).toHaveBeenCalledWith({
        companyId,
        query,
        page,
        pageSize,
        trx
      });
    }, 20000);
  });
});
