import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { CompanyService } from '@modules/company.service';
import { CreateCompanyDto } from '@dto/create-company.dto';
import { Language } from '@interfaces/language.enum';
import { UpdateCompanyDto } from '@dto/update-company.dto';
import { TransferOwnershipDto } from '@dto/transfer-ownership.dto';
import { DeleteCompanyDto } from '@dto/delete-company.dto';

dotenv.config({ path: '.env.test' });

describe('CompanyController', () => {
  let controller: CompanyController;
  let companyService: CompanyService;

  const mockCompanyService = {
    createCompany: jest.fn().mockImplementation(() => {
      return;
    }),
    getCompanyInformationById: jest.fn().mockImplementation(() => {
      return;
    }),
    getCompanyUsers: jest.fn().mockImplementation(() => {
      return;
    }),
    updateCompanyInformation: jest.fn().mockImplementation(() => {
      return;
    }),
    transferCompanyOwnership: jest.fn().mockImplementation(() => {
      return;
    }),
    deleteCompanyAccount: jest.fn().mockImplementation(() => {
      return;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService
        }
      ]
    })
      .overrideProvider(CompanyService)
      .useValue(mockCompanyService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create Company', () => {
    it('Should call createCompany method with correct parameters', async () => {
      const payload: CreateCompanyDto = {
        companyLocation: '5th Avenu',
        companyName: 'Test',
        companyWebsite: 'test.com',
        companyOwnerEmail: 'test@test.com',
        companyMembers: [{ email: 'test1@test.com', role: 'DEFAULT' }],
        tac: true,
        language: Language.PL
      };
      const trx: any = {};

      await controller.createCompany(payload, trx);

      expect(companyService.createCompany).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Company Information', () => {
    it('Should call getCompanyInformationById method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const trx: any = {};

      await controller.getCompanyInformationById(companyId, trx);

      expect(companyService.getCompanyInformationById).toHaveBeenCalledWith({
        companyId,
        trx
      });
    }, 20000);
  });

  describe('Company Users', () => {
    it('Should call getCompanyUsers method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const page = '0';
      const pageSize = '5';
      const trx: any = {};

      await controller.getCompanyUsers(companyId, page, pageSize, trx);

      expect(companyService.getCompanyUsers).toHaveBeenCalledWith({
        companyId,
        page,
        pageSize,
        trx
      });
    }, 20000);
  });

  describe('Update Company', () => {
    it('Should call updateCompanyInformation method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: UpdateCompanyDto = {
        companyLocation: '6th Avenu',
        companyName: 'Test2',
        companyWebsite: 'test2.com'
      };
      const trx: any = {};

      await controller.updateCompanyInformation(companyId, payload, trx);

      expect(companyService.updateCompanyInformation).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('Transfer Ownership', () => {
    it('Should call transferCompanyOwnership method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const userId = 'user-id';
      const payload: TransferOwnershipDto = {
        newCompanyOwnerEmail: 'test2@test.com',
        mfaCode: '123123',
        phoneCode: '123123',
        language: Language.PL
      };
      const trx: any = {};

      await controller.transferCompanyOwnership(
        companyId,
        userId,
        payload,
        trx
      );

      expect(companyService.transferCompanyOwnership).toHaveBeenCalledWith({
        companyId,
        userId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('Delete Company', () => {
    it('Should call deleteCompanyAccount method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const userId = 'user-id';
      const payload: DeleteCompanyDto = {
        passphrase: '123123123',
        password: '12qw!@QW',
        recoveryKeys: undefined,
        mfaCode: '123123',
        phoneCode: '123123',
        language: Language.PL
      };
      const trx: any = {};

      await controller.deleteCompanyAccount(companyId, userId, payload, trx);

      expect(companyService.deleteCompanyAccount).toHaveBeenCalledWith({
        companyId,
        userId,
        payload,
        trx
      });
    }, 20000);
  });
});
