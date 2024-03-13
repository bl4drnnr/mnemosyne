import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { CompanyService } from '@modules/company.service';
import { Sequelize } from 'sequelize-typescript';
import { RegistrationCompanyInterface } from '@interfaces/registration-company.interface';
import { GetCompanyInfoByIdInterface } from '@interfaces/get-company-info-by-id.interface';
import { GetCompanyUsersInterface } from '@interfaces/get-company-users.interface';
import { UpdateCompanyInfoInterface } from '@interfaces/update-company-info.interface';
import { TransferOwnershipInterface } from '@interfaces/transfer-ownership.interface';
import { DeleteCompanyInterface } from '@interfaces/delete-company.interface';
import { CreateCompanyDto } from '@dto/create-company.dto';
import { Language } from '@interfaces/language.enum';
import { UpdateCompanyDto } from '@dto/update-company.dto';
import { TransferOwnershipDto } from '@dto/transfer-ownership.dto';
import { DeleteCompanyDto } from '@dto/delete-company.dto';

dotenv.config({ path: '.env.test' });

describe('CompanyController', () => {
  let controller: CompanyController;
  let companyService: CompanyService;
  let sequelize: Sequelize;

  const mockCompanyService = {
    createCompany: jest
      .fn()
      .mockImplementation(({ payload, trx }: RegistrationCompanyInterface) => {
        return;
      }),
    getCompanyInformationById: jest
      .fn()
      .mockImplementation(
        ({ companyId, trx: transaction }: GetCompanyInfoByIdInterface) => {
          return;
        }
      ),
    getCompanyUsers: jest
      .fn()
      .mockImplementation(
        ({
          companyId,
          page,
          pageSize,
          trx: transaction
        }: GetCompanyUsersInterface) => {
          return;
        }
      ),
    updateCompanyInformation: jest
      .fn()
      .mockImplementation(
        ({ companyId, payload, trx }: UpdateCompanyInfoInterface) => {
          return;
        }
      ),
    transferCompanyOwnership: jest
      .fn()
      .mockImplementation(
        ({ companyId, userId, payload, trx }: TransferOwnershipInterface) => {
          return;
        }
      ),
    deleteCompanyAccount: jest
      .fn()
      .mockImplementation(
        ({ companyId, userId, payload, trx }: DeleteCompanyInterface) => {
          return;
        }
      )
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
      const trx = await sequelize.transaction();

      await controller.createCompany(payload, trx);

      expect(companyService.createCompany).toHaveBeenCalledWith({
        payload,
        trx
      });
    });
  });

  describe('Company Information', () => {
    it('Should call getCompanyInformationById method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const trx = await sequelize.transaction();

      await controller.getCompanyInformationById(companyId, trx);

      expect(companyService.getCompanyInformationById).toHaveBeenCalledWith({
        companyId,
        trx
      });
    });
  });

  describe('Company Users', () => {
    it('Should call getCompanyUsers method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const page = '0';
      const pageSize = '5';
      const trx = await sequelize.transaction();

      await controller.getCompanyUsers(companyId, page, pageSize, trx);

      expect(companyService.getCompanyUsers).toHaveBeenCalledWith({
        companyId,
        page,
        pageSize,
        trx
      });
    });
  });

  describe('Update Company', () => {
    it('Should call updateCompanyInformation method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: UpdateCompanyDto = {
        companyLocation: '6th Avenu',
        companyName: 'Test2',
        companyWebsite: 'test2.com'
      };
      const trx = await sequelize.transaction();

      await controller.updateCompanyInformation(companyId, payload, trx);

      expect(companyService.updateCompanyInformation).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    });
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
      const trx = await sequelize.transaction();

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
    });
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
      const trx = await sequelize.transaction();

      await controller.deleteCompanyAccount(companyId, userId, payload, trx);

      expect(companyService.deleteCompanyAccount).toHaveBeenCalledWith({
        companyId,
        userId,
        payload,
        trx
      });
    });
  });
});
