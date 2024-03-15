import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from '@modules/company-users.service';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { Sequelize } from 'sequelize-typescript';
import { InviteUserToCompanyInterface } from '@interfaces/invite-user-to-company.interface';
import { GetCompanyMemberInfoInterface } from '@interfaces/get-company-member-info.interface';
import { UpdateCompanyMemberInfoInterface } from '@interfaces/update-company-member-info.interface';
import { DeleteCompanyMemberInterface } from '@interfaces/delete-company-member.interface';
import { SearchCompanyMemberInterface } from '@interfaces/search-company-member.interface';
import { InviteUserToCompanyDto } from '@dto/invite-user-to-company.dto';
import { Language } from '@interfaces/language.enum';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { DeleteCompanyMemberDto } from '@dto/delete-company-member.dto';

dotenv.config({ path: '.env.test' });

describe('CompanyUsersController', () => {
  let controller: CompanyUsersController;
  let companyUsersService: CompanyUsersService;
  let sequelize: Sequelize;

  const mockCompanyUsersService = {
    inviteUserToCompany: jest
      .fn()
      .mockImplementation(
        ({ userId, payload, trx }: InviteUserToCompanyInterface) => {
          return;
        }
      ),
    getCompanyMemberInfo: jest
      .fn()
      .mockImplementation(
        ({
          companyId,
          memberId: userId,
          trx
        }: GetCompanyMemberInfoInterface) => {
          return;
        }
      ),
    updateCompanyMemberInfo: jest
      .fn()
      .mockImplementation(
        ({
          companyId,
          payload,
          memberId: userId,
          trx
        }: UpdateCompanyMemberInfoInterface) => {
          return;
        }
      ),
    deleteCompanyMember: jest
      .fn()
      .mockImplementation(
        ({
          userId,
          companyId,
          payload,
          memberId,
          trx
        }: DeleteCompanyMemberInterface) => {
          return;
        }
      ),
    searchCompanyMembers: jest
      .fn()
      .mockImplementation(
        ({
          companyId,
          query,
          page,
          pageSize,
          trx: transaction
        }: SearchCompanyMemberInterface) => {
          return;
        }
      )
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
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE
    });
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Invite User', () => {
    it('Should call inviteUserToCompany method with correct parameters', async () => {
      const userId = 'user-id';
      const payload: InviteUserToCompanyDto = {
        email: 'test2@test.com',
        language: Language.PL,
        role: 'ADMIN'
      };
      const trx = await sequelize.transaction();

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
      const trx = await sequelize.transaction();

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
      const trx = await sequelize.transaction();

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
      const trx = await sequelize.transaction();

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
      const trx = await sequelize.transaction();

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
