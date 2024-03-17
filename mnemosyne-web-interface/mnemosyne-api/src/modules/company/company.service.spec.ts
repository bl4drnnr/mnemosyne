import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyExistsException } from '@exceptions/company-exists.exception';
import { Language } from '@interfaces/language.enum';
import { Role } from '@custom-types/role.type';
import { UsersService } from '@modules/users.service';
import { User } from '@models/user.model';
import { Company } from '@models/company.model';
import { CompanyUsersService } from '@modules/company-users.service';
import { CompanyUser } from '@models/company-user.model';
import { RolesService } from '@modules/roles.service';
import { EmailService } from '@shared/email.service';
import { CryptographicService } from '@shared/cryptographic.service';
import { AuthService } from '@modules/auth.service';
import { getModelToken } from '@nestjs/sequelize';
import { ApiConfigService } from '@shared/config.service';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '@shared/utils.service';
import { Role as RoleModel } from '@models/role.model';
import { UserRole } from '@models/user-role.model';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { TimeService } from '@shared/time.service';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { UserSettings } from '@models/user-settings.model';

dotenv.config({ path: '.env.test' });

describe('CompanyService', () => {
  let service: CompanyService;

  const userRepositoryToken = getModelToken(User);
  const companyRepositoryToken = getModelToken(Company);
  const companyUserRepositoryToken = getModelToken(CompanyUser);
  const roleRepositoryToken = getModelToken(RoleModel);
  const userRoleRepositoryToken = getModelToken(UserRole);
  const confirmationHashRepositoryToken = getModelToken(ConfirmationHash);
  const userSettingsRepositoryToken = getModelToken(UserSettings);

  const companyOwnerId = uuid.v4();
  const mockAuthService = {};
  const mockCompanyRepository = {
    findByPk: jest.fn().mockResolvedValue({
      companyName: 'Test Company',
      companyLocation: 'Test Location',
      companyWebsite: 'test.com',
      companyOwnerId
    })
  };
  const mockEmailTemplatesService = {};
  const mockConfirmationHashRepository = {
    create: jest.fn()
  };
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue({ id: uuid.v4() }),
    update: jest.fn(),
    findByPk: jest.fn().mockResolvedValue({ email: 'test@test.com' }),
    getUserByEmail: jest.fn()
  };
  const mockUserSettingsRepository = {
    create: jest.fn().mockResolvedValue({ id: uuid.v4() })
  };
  const mockCompanyUserRepository = {
    create: jest.fn().mockResolvedValue({ id: uuid.v4() })
  };
  const mockRoleRepository = {
    findAll: jest.fn().mockResolvedValue(['PRIMARY_ADMIN', 'ADMIN', 'DEFAULT']),
    create: jest.fn().mockResolvedValue({ id: uuid.v4() })
  };
  const mockUserRoleRepository = {
    findOne: jest.fn(),
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        CryptographicService,
        ConfirmationHashService,
        ApiConfigService,
        ConfigService,
        TimeService,
        CompanyUsersService,
        UtilsService,
        RolesService,
        EmailService,
        UsersService,
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: companyRepositoryToken,
          useValue: mockCompanyRepository
        },
        {
          provide: companyUserRepositoryToken,
          useValue: mockCompanyUserRepository
        },
        {
          provide: roleRepositoryToken,
          useValue: mockRoleRepository
        },
        {
          provide: userRoleRepositoryToken,
          useValue: mockUserRoleRepository
        },
        {
          provide: userSettingsRepositoryToken,
          useValue: mockUserSettingsRepository
        },
        {
          provide: confirmationHashRepositoryToken,
          useValue: mockConfirmationHashRepository
        },
        {
          provide: userRepositoryToken,
          useValue: mockUserRepository
        },
        {
          provide: EmailTemplatesService,
          useValue: mockEmailTemplatesService
        }
      ]
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCompany', () => {
    const mockPayload = {
      id: uuid.v4(),
      companyName: 'Test Company',
      companyOwnerEmail: 'owner@test.com',
      companyWebsite: 'https://test.com',
      companyLocation: 'Test Location',
      companyMembers: [
        { email: 'member1@test.com', role: 'DEFAULT' as Role },
        { email: 'member2@test.com', role: 'DEFAULT' as Role }
      ],
      tac: true,
      language: Language.PL
    };

    it('should throw CompanyExistsException if company already exists', async () => {
      jest
        .spyOn(service, 'getCompanyByName')
        .mockResolvedValueOnce({ id: uuid.v4() } as unknown as Company);

      await expect(async () => {
        await service.createCompany({
          payload: mockPayload
        });
      }).rejects.toThrow(CompanyExistsException);
    }, 20000);
  });

  describe('getCompanyInformationById', () => {
    it('should return company information including owner email', async () => {
      const companyId = uuid.v4();
      const mockCompany = {
        companyName: 'Test Company',
        companyLocation: 'Test Location',
        companyWebsite: 'test.com',
        companyOwnerId
      };
      const mockUser = {
        email: 'test@test.com'
      };

      const result = await service.getCompanyInformationById({ companyId });

      expect(result).toEqual({
        companyName: mockCompany.companyName,
        companyLocation: mockCompany.companyLocation,
        companyWebsite: mockCompany.companyWebsite,
        companyOwnerId: mockCompany.companyOwnerId,
        companyOwnerEmail: mockUser.email
      });
    }, 20000);
  });
});
