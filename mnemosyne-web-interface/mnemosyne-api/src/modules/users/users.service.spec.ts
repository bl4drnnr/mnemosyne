import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '@models/user.model';
import { getModelToken } from '@nestjs/sequelize';
import { CryptographicService } from '@shared/cryptographic.service';
import { EmailService } from '@shared/email.service';
import { TimeService } from '@shared/time.service';
import { ApiConfigService } from '@shared/config.service';
import { UserSettings } from '@models/user-settings.model';
import { CompanyService } from '@modules/company.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { ConfigService } from '@nestjs/config';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { Language } from '@interfaces/language.enum';
import { ResetPasswordEmailDto } from '@dto/reset-password-email.dto';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { AuthService } from '@modules/auth.service';
import { EmailTemplatesService } from '@shared/email-templates.service';

dotenv.config({ path: '.env.test' });

describe('UsersService', () => {
  let service: UsersService;
  let cryptographicService: CryptographicService;
  let userRepository: typeof User;

  const userRepositoryToken = getModelToken(User);
  const userSettingsRepositoryToken = getModelToken(UserSettings);
  const confirmationHashRepositoryToken = getModelToken(ConfirmationHash);

  const mockAuthService = {};
  const mockCompanyService = {};
  const mockEmailTemplatesService = {};
  const mockConfirmationHashRepository = {};
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
    getUserByEmail: jest.fn()
  };
  const mockUserSettingsRepository = {
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        CryptographicService,
        TimeService,
        ApiConfigService,
        ConfigService,
        ConfirmationHashService,
        EmailService,
        {
          provide: CompanyService,
          useValue: mockCompanyService
        },
        {
          provide: userRepositoryToken,
          useValue: mockUserRepository
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
          provide: EmailTemplatesService,
          useValue: mockEmailTemplatesService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    cryptographicService =
      module.get<CryptographicService>(CryptographicService);
    userRepository = module.get<typeof User>(userRepositoryToken);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('Should return user if found by email', async () => {
      const mockUser = { email: 'test@test.com' };
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      const newUserEmail = 'test@test.com';
      const trx: any = {};

      const result = await service.getUserByEmail({
        email: newUserEmail,
        trx
      });

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        rejectOnEmpty: undefined,
        where: { email: newUserEmail },
        include: { all: true },
        transaction: trx
      });
    }, 20000);

    it('Should return null if user not found by email', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      const newUserEmail = 'nonexistent@test.com';
      const trx: any = {};

      const result = await service.getUserByEmail({
        email: newUserEmail,
        trx
      });

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        rejectOnEmpty: undefined,
        where: { email: newUserEmail },
        include: { all: true },
        transaction: trx
      });
    }, 20000);
  });

  describe('createUser', () => {
    it('Should create a new user and return it', async () => {
      const mockUser = { email: 'test@test.com' };
      (userRepository.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const newUserPayload = {
        id: uuid.v4(),
        email: 'test@test.com',
        password: '123'
      };
      const trx: any = {};

      const result = await service.createUser({
        payload: newUserPayload,
        trx
      });

      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith(newUserPayload, {
        transaction: trx
      });
    }, 20000);
  });

  describe('updateUser', () => {
    it('Should update the user and return void', async () => {
      (userRepository.update as jest.Mock).mockResolvedValueOnce([1]);

      const userId = uuid.v4();
      const newUserPayload = { email: 'updated@test.com' };
      const trx: any = {};

      await service.updateUser({
        payload: newUserPayload,
        userId,
        trx
      });

      expect(userRepository.update).toHaveBeenCalledWith(
        { ...newUserPayload },
        { returning: undefined, where: { id: userId }, transaction: trx }
      );
    }, 20000);
  });

  describe('getUserById', () => {
    it('Should return the user if found by ID', async () => {
      const id = uuid.v4();
      const mockUser = { id, email: 'test@test.com' };
      (userRepository.findByPk as jest.Mock).mockResolvedValueOnce(mockUser);

      const trx: any = {};

      const result = await service.getUserById({
        id,
        trx
      });

      expect(result).toEqual(mockUser);
      expect(userRepository.findByPk).toHaveBeenCalledWith(id, {
        include: { all: true },
        transaction: trx
      });
    }, 20000);

    it('Should return null if user not found by ID', async () => {
      (userRepository.findByPk as jest.Mock).mockResolvedValueOnce(null);

      const nonExistentUserId = uuid.v4();
      const trx: any = {};

      const result = await service.getUserById({
        id: nonExistentUserId,
        trx
      });

      expect(result).toBeNull();
      expect(userRepository.findByPk).toHaveBeenCalledWith(nonExistentUserId, {
        include: { all: true },
        transaction: trx
      });
    }, 20000);
  });

  describe('verifyUserCredentials', () => {
    const mockUser = {
      id: uuid.v4(),
      email: 'test@test.com',
      password: 'hashed_password'
    };
    const mockPassword = 'password';

    it('Should return the user if credentials are valid', async () => {
      jest
        .spyOn(service, 'getUserByEmail')
        .mockResolvedValueOnce(mockUser as unknown as Promise<User>);
      jest
        .spyOn(cryptographicService, 'comparePasswords')
        .mockResolvedValueOnce(true);

      const result = await service.verifyUserCredentials({
        email: mockUser.email,
        password: mockPassword
      });

      expect(result).toEqual(mockUser);
    }, 20000);

    it('Should throw WrongCredentialsException if user not found', async () => {
      jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(null);

      await expect(async () => {
        await service.verifyUserCredentials({
          email: mockUser.email,
          password: mockPassword
        });
      }).rejects.toThrow(WrongCredentialsException);
    }, 20000);

    it('Should throw WrongCredentialsException if password does not match', async () => {
      jest
        .spyOn(service, 'getUserByEmail')
        .mockResolvedValueOnce(mockUser as unknown as Promise<User>);
      jest
        .spyOn(cryptographicService, 'comparePasswords')
        .mockResolvedValueOnce(false);

      await expect(async () => {
        await service.verifyUserCredentials({
          email: mockUser.email,
          password: mockPassword
        });
      }).rejects.toThrow(WrongCredentialsException);
    }, 20000);
  });

  describe('forgotPassword', () => {
    const mockPayload = { email: 'test@test.com', language: Language.PL };
    const mockUser = {
      id: uuid.v4(),
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      userSettings: { passwordChanged: new Date() }
    };

    it('Should return ResetPasswordEmailDto if user does not exist', async () => {
      jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(null);

      const result = await service.forgotPassword({
        payload: mockPayload
      });

      expect(result).toBeInstanceOf(ResetPasswordEmailDto);
    }, 20000);

    it('Should throw PasswordChangedException if password was changed within the last 24 hours', async () => {
      jest
        .spyOn(service, 'getUserByEmail')
        .mockResolvedValueOnce(mockUser as unknown as Promise<User>);

      await expect(async () => {
        await service.forgotPassword({
          payload: mockPayload
        });
      }).rejects.toThrow(PasswordChangedException);
    }, 20000);
  });
});
