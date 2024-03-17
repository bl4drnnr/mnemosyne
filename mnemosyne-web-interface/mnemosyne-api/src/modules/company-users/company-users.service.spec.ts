import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersService } from './company-users.service';
import { UsersService } from '@modules/users.service';
import { CompanyService } from '@modules/company.service';
import { EmailService } from '@shared/email.service';
import { AuthService } from '@modules/auth.service';
import { CompanyUser } from '@models/company-user.model';
import { getModelToken } from '@nestjs/sequelize';
import { Language } from '@interfaces/language.enum';
import { User } from '@models/user.model';
import { Role } from '@custom-types/role.type';
import { Company } from '@models/company.model';
import { CompanyMemberNotFoundException } from '@exceptions/company-member-not-found.exception';
import { UserUpdatedDto } from '@dto/user-updated.dto';
import { CompanyMemberDeletedDto } from '@dto/company-member-deleted.dto';
import { HttpException } from '@nestjs/common';

dotenv.config({ path: '.env.test' });

describe('CompanyUsersService', () => {
  let service: CompanyUsersService;
  let usersService: UsersService;
  let companyService: CompanyService;
  let emailService: EmailService;
  let authService: AuthService;
  let companyUserRepository: typeof CompanyUser;

  const companyUserRepositoryToken = getModelToken(CompanyUser);

  const mockCompanyUsersRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn()
  };
  const mockUsersService = {
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUserInfo: jest.fn()
  };
  const mockCompanyService = {
    getCompanyByUserId: jest.fn(),
    getCompanyById: jest.fn()
  };
  const mockEmailService = {
    sendCompanyMemberEmail: jest.fn(),
    sendDeletionCompanyMemberEmail: jest.fn()
  };
  const mockAuthService = {
    checkUserMfaStatus: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyUsersService,
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: companyUserRepositoryToken,
          useValue: mockCompanyUsersRepository
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: CompanyService,
          useValue: mockCompanyService
        },
        {
          provide: EmailService,
          useValue: mockEmailService
        }
      ]
    }).compile();

    service = module.get<CompanyUsersService>(CompanyUsersService);
    usersService = module.get<UsersService>(UsersService);
    companyService = module.get<CompanyService>(CompanyService);
    emailService = module.get<EmailService>(EmailService);
    authService = module.get<AuthService>(AuthService);
    companyUserRepository = module.get<typeof CompanyUser>(
      companyUserRepositoryToken
    );
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('inviteUserToCompany', () => {
    it('should invite user to the company and send email', async () => {
      const userId = uuid.v4();
      const payload = {
        email: 'test@example.com',
        role: 'ADMIN' as Role,
        language: Language.PL
      };
      const trx: any = {};

      const companyOwnerId = uuid.v4();
      const companyOwnerEmail = 'owner@example.com';
      const companyInfoId = uuid.v4();
      const companyInfo = {
        companyName: 'Test Company',
        companyLocation: 'Test Location',
        companyWebsite: 'test.com',
        companyOwnerEmail
      };

      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce({
        id: companyOwnerId,
        email: companyOwnerEmail,
        company: { id: companyInfoId }
      } as unknown as User);

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);

      const createdUser = { id: uuid.v4() };
      jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValueOnce(createdUser as unknown as User);

      jest
        .spyOn(companyService, 'getCompanyByUserId')
        .mockResolvedValueOnce(companyInfo as unknown as Company);

      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce({
        id: companyOwnerId,
        email: companyOwnerEmail,
        company: { id: companyInfoId }
      } as unknown as User);

      await service.inviteUserToCompany({ userId, payload, trx });

      expect(usersService.getUserById).toHaveBeenCalledWith({
        id: userId,
        trx
      });
      expect(usersService.getUserByEmail).toHaveBeenCalledWith({
        email: payload.email,
        trx
      });
      expect(usersService.createUser).toHaveBeenCalledWith({
        payload: { email: payload.email },
        trx
      });
      expect(companyService.getCompanyByUserId).toHaveBeenCalledWith({
        userId,
        trx
      });

      expect(emailService.sendCompanyMemberEmail).toHaveBeenCalledWith({
        payload: {
          to: payload.email,
          confirmationType: 'COMPANY_INVITATION',
          userId: createdUser.id
        },
        isUserExists: false,
        companyInfo,
        userInfo: {
          email: payload.email,
          firstName: null,
          lastName: null
        },
        language: payload.language,
        trx
      });
    }, 20000);
  });

  describe('getCompanyMemberInfo', () => {
    it('should get company member info if member exists', async () => {
      const companyId = uuid.v4();
      const userId = uuid.v4();
      const trx: any = {};

      const companyMember = {
        id: uuid.v4(),
        user: {
          id: userId,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          namePronunciation: 'John',
          homeAddress: '123 Main St',
          homePhone: '123-456-7890'
        }
      };

      jest
        .spyOn(companyUserRepository, 'findOne')
        .mockResolvedValueOnce(companyMember as any);

      const result = await service.getCompanyMemberInfo({
        companyId,
        memberId: userId,
        trx
      });

      expect(companyUserRepository.findOne).toHaveBeenCalledWith({
        where: { companyId, userId },
        include: { model: User },
        transaction: trx
      });
      expect(result).toEqual({
        memberId: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        namePronunciation: 'John',
        homeAddress: '123 Main St',
        homePhone: '123-456-7890'
      });
    }, 20000);

    it('should throw CompanyMemberNotFoundException if member does not exist', async () => {
      const companyId = uuid.v4();
      const userId = uuid.v4();
      const trx: any = {};

      jest.spyOn(companyUserRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.getCompanyMemberInfo({ companyId, memberId: userId, trx })
      ).rejects.toThrowError(CompanyMemberNotFoundException);
    }, 20000);
  });

  describe('updateCompanyMemberInfo', () => {
    it('should update company member info if member exists', async () => {
      const companyId = uuid.v4();
      const userId = uuid.v4();
      const payload = {
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'Member'
      };
      const trx: any = {};

      const companyMember = {
        id: uuid.v4(),
        user: {
          id: userId
        }
      };

      jest
        .spyOn(companyUserRepository, 'findOne')
        .mockResolvedValueOnce(companyMember as any);

      const result = await service.updateCompanyMemberInfo({
        companyId,
        payload,
        memberId: userId,
        trx
      });

      expect(companyUserRepository.findOne).toHaveBeenCalledWith({
        where: { companyId, userId },
        include: { model: User },
        transaction: trx
      });
      expect(usersService.updateUserInfo).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
      expect(result).toBeInstanceOf(UserUpdatedDto);
    }, 20000);

    it('should throw CompanyMemberNotFoundException if member does not exist', async () => {
      const companyId = uuid.v4();
      const userId = uuid.v4();
      const payload = {
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'Member'
      };
      const trx: any = {};

      jest.spyOn(companyUserRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.updateCompanyMemberInfo({
          companyId,
          payload,
          memberId: userId,
          trx
        })
      ).rejects.toThrowError(CompanyMemberNotFoundException);
    }, 20000);
  });

  describe('deleteCompanyMember', () => {
    it('should delete company member if member exists and send deletion email', async () => {
      const userId = uuid.v4();
      const companyId = uuid.v4();
      const memberId = uuid.v4();
      const payload = {
        mfaCode: '123456',
        phoneCode: '123456',
        language: Language.EN
      };
      const trx: any = {};

      const companyMember = {
        id: uuid.v4(),
        user: {
          id: memberId,
          email: 'member@example.com'
        }
      };

      jest.spyOn(companyUserRepository, 'findOne').mockResolvedValueOnce({
        user: { email: 'member@example.com' }
      } as any);

      const getUserByIdSpy = jest
        .spyOn(usersService, 'getUserById')
        .mockResolvedValueOnce({
          email: 'admin@example.com',
          userSettings: {}
        } as any);
      const getCompanyByIdSpy = jest
        .spyOn(companyService, 'getCompanyById')
        .mockResolvedValueOnce({
          companyName: 'Test Company'
        } as any);
      const sendDeletionCompanyMemberEmailSpy = jest
        .spyOn(emailService, 'sendDeletionCompanyMemberEmail')
        .mockResolvedValueOnce();

      const result = await service.deleteCompanyMember({
        userId,
        companyId,
        payload,
        memberId,
        trx
      });

      expect(getUserByIdSpy).toHaveBeenCalledWith({ id: userId, trx });
      expect(authService.checkUserMfaStatus).toHaveBeenCalledWith({
        mfaCode: payload.mfaCode,
        phoneCode: payload.phoneCode,
        userSettings: {},
        userId,
        trx
      });
      expect(companyUserRepository.destroy).toHaveBeenCalledWith({
        where: { companyId, userId: memberId },
        transaction: trx
      });
      expect(getCompanyByIdSpy).toHaveBeenCalledWith({ id: companyId, trx });
      expect(sendDeletionCompanyMemberEmailSpy).toHaveBeenCalledWith({
        to: companyMember.user.email,
        performedBy: 'admin@example.com',
        companyName: 'Test Company',
        language: Language.EN
      });
      expect(result).toBeInstanceOf(CompanyMemberDeletedDto);
    }, 20000);

    it('should throw CompanyMemberNotFoundException if member does not exist', async () => {
      const userId = uuid.v4();
      const companyId = uuid.v4();
      const memberId = uuid.v4();
      const payload = {
        mfaCode: '123456',
        phoneCode: '123456',
        language: Language.EN
      };
      const trx: any = {};

      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce({} as any);
      jest.spyOn(companyUserRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.deleteCompanyMember({
          userId,
          companyId,
          payload,
          memberId,
          trx
        })
      ).rejects.toThrowError(CompanyMemberNotFoundException);
    }, 20000);

    it('should throw HttpException if checkUserMfaStatus throws an error', async () => {
      const userId = uuid.v4();
      const companyId = uuid.v4();
      const memberId = uuid.v4();
      const payload = {
        mfaCode: '123456',
        phoneCode: '123456',
        language: Language.EN
      };
      const trx: any = {};

      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce({} as any);
      jest.spyOn(authService, 'checkUserMfaStatus').mockRejectedValueOnce({
        response: { message: 'Error message', status: 500 }
      });

      await expect(
        service.deleteCompanyMember({
          userId,
          companyId,
          payload,
          memberId,
          trx
        })
      ).rejects.toThrowError(HttpException);
    }, 20000);
  });
});
