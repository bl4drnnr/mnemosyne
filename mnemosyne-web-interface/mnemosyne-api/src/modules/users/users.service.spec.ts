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
import { Sequelize } from 'sequelize-typescript';
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
  let confirmationHashService: ConfirmationHashService;
  let emailService: EmailService;
  let sequelize: Sequelize;
  let userRepository: typeof User;
  let userSettingsRepository: typeof UserSettings;
  let confirmationHashRepository: typeof ConfirmationHash;

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
    confirmationHashService = module.get<ConfirmationHashService>(
      ConfirmationHashService
    );
    emailService = module.get<EmailService>(EmailService);
    userRepository = module.get<typeof User>(userRepositoryToken);
    userSettingsRepository = module.get<typeof UserSettings>(
      userSettingsRepositoryToken
    );
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
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return user if found by email', async () => {
      const mockUser = { email: 'test@test.com' };
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      const newUserEmail = 'test@test.com';
      const trx = await sequelize.transaction();

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
    });

    it('should return null if user not found by email', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      const newUserEmail = 'nonexistent@test.com';
      const trx = await sequelize.transaction();

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
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const mockUser = { email: 'test@test.com' };
      (userRepository.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const newUserPayload = {
        id: uuid.v4(),
        email: 'test@test.com',
        password: '123'
      };
      const trx = await sequelize.transaction();

      const result = await service.createUser({
        payload: newUserPayload,
        trx
      });

      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith(newUserPayload, {
        transaction: trx
      });
    });
  });

  describe('updateUser', () => {
    it('should update the user and return void', async () => {
      (userRepository.update as jest.Mock).mockResolvedValueOnce([1]);

      const userId = uuid.v4();
      const newUserPayload = { email: 'updated@test.com' };
      const trx = await sequelize.transaction();

      await service.updateUser({
        payload: newUserPayload,
        userId,
        trx
      });

      expect(userRepository.update).toHaveBeenCalledWith(
        { ...newUserPayload },
        { returning: undefined, where: { id: userId }, transaction: trx }
      );
    });
  });

  describe('getUserById', () => {
    it('should return the user if found by ID', async () => {
      const id = uuid.v4();
      const mockUser = { id, email: 'test@test.com' };
      (userRepository.findByPk as jest.Mock).mockResolvedValueOnce(mockUser);

      const trx = await sequelize.transaction();

      const result = await service.getUserById({
        id,
        trx
      });

      expect(result).toEqual(mockUser);
      expect(userRepository.findByPk).toHaveBeenCalledWith(id, {
        include: { all: true },
        transaction: trx
      });
    });

    it('should return null if user not found by ID', async () => {
      (userRepository.findByPk as jest.Mock).mockResolvedValueOnce(null);

      const nonExistentUserId = uuid.v4();
      const trx = await sequelize.transaction();

      const result = await service.getUserById({
        id: nonExistentUserId,
        trx
      });

      expect(result).toBeNull();
      expect(userRepository.findByPk).toHaveBeenCalledWith(nonExistentUserId, {
        include: { all: true },
        transaction: trx
      });
    });
  });

  describe('verifyUserCredentials', () => {
    const mockUser = {
      id: uuid.v4(),
      email: 'test@test.com',
      password: 'hashed_password'
    };
    const mockPassword = 'password';

    it('should return the user if credentials are valid', async () => {
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
    });

    it('should throw WrongCredentialsException if user not found', async () => {
      jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(null);

      await expect(async () => {
        await service.verifyUserCredentials({
          email: mockUser.email,
          password: mockPassword
        });
      }).rejects.toThrow(WrongCredentialsException);
    });

    it('should throw WrongCredentialsException if password does not match', async () => {
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
    });
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

    it('should return ResetPasswordEmailDto if user does not exist', async () => {
      jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(null);

      const result = await service.forgotPassword({
        payload: mockPayload
      });

      expect(result).toBeInstanceOf(ResetPasswordEmailDto);
    });

    it('should throw PasswordChangedException if password was changed within the last 24 hours', async () => {
      jest
        .spyOn(service, 'getUserByEmail')
        .mockResolvedValueOnce(mockUser as unknown as Promise<User>);

      await expect(async () => {
        await service.forgotPassword({
          payload: mockPayload
        });
      }).rejects.toThrow(PasswordChangedException);
    });
  });
});
