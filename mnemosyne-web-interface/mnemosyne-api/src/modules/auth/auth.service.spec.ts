import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Sequelize } from 'sequelize-typescript';
import { Session } from '@models/session.model';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { LogInUserResponseDto } from '@dto/log-in-user.dto';
import { UsersService } from '@modules/users.service';
import { CompanyUser } from '@models/company-user.model';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { User } from '@models/user.model';
import { CryptographicService } from '@shared/cryptographic.service';
import { AuthGuard } from '@guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiConfigService } from '@shared/config.service';
import { getModelToken } from '@nestjs/sequelize';
import { PhoneService } from '@shared/phone.service';
import { TimeService } from '@shared/time.service';
import { RolesService } from '@modules/roles.service';
import { EmailService } from '@shared/email.service';
import { CompanyService } from '@modules/company.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UserSettings } from '@models/user-settings.model';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { AccountNotConfirmedException } from '@exceptions/account-not-confirmed.exception';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { UserCreatedDto } from '@dto/user-created.dto';
import { Language } from '@interfaces/language.enum';
import { UserAlreadyExistsException } from '@exceptions/user-already-exists.exception';
import { TacNotAcceptedException } from '@exceptions/tac-not-accepted.exception';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { LoggedOutDto } from '@dto/logged-out.dto';
import { TokenTwoFaRequiredDto } from '@dto/token-two-fa-required.dto';
import { FullMfaRequiredDto } from '@dto/full-mfa-required.dto';
import { SmsTemplatesService } from '@shared/sms-templates.service';

dotenv.config({ path: '.env.test' });

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let cryptographicService: CryptographicService;
  let phoneService: PhoneService;
  let companyService: CompanyService;
  let confirmationHashService: ConfirmationHashService;
  let emailService: EmailService;
  let sequelize: Sequelize;
  let sessionRepository: typeof Session;
  let userRepository: typeof User;
  let userSettingsRepository: typeof UserSettings;
  let confirmationHashRepository: typeof ConfirmationHash;

  const userRepositoryToken = getModelToken(User);
  const sessionRepositoryToken = getModelToken(Session);
  const userSettingsRepositoryToken = getModelToken(UserSettings);
  const confirmationHashRepositoryToken = getModelToken(ConfirmationHash);

  const mockTimeService = {};
  const mockEmailTemplatesService = {};
  const mockCompanyService = {};
  const mockConfirmationHashRepository = {};
  const mockSmsTemplatesService = {};
  const mockSessionRepository = {
    destroy: jest.fn()
  };
  const mockRolesService = {
    getUserRolesByCompanyUserId: jest.fn()
  };
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
    getUserByEmail: jest.fn()
  };
  const mockUserSettingsRepository = {
    create: jest.fn(),
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        CryptographicService,
        JwtService,
        ApiConfigService,
        ConfigService,
        ConfirmationHashService,
        EmailService,
        PhoneService,
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
          provide: SmsTemplatesService,
          useValue: mockSmsTemplatesService
        },
        {
          provide: CompanyService,
          useValue: mockCompanyService
        },
        {
          provide: sessionRepositoryToken,
          useValue: mockSessionRepository
        },
        {
          provide: TimeService,
          useValue: mockTimeService
        },
        {
          provide: RolesService,
          useValue: mockRolesService
        },
        {
          provide: EmailTemplatesService,
          useValue: mockEmailTemplatesService
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    emailService = module.get<EmailService>(EmailService);
    companyService = module.get<CompanyService>(CompanyService);
    phoneService = module.get<PhoneService>(PhoneService);
    cryptographicService =
      module.get<CryptographicService>(CryptographicService);
    confirmationHashService = module.get<ConfirmationHashService>(
      ConfirmationHashService
    );
    userRepository = module.get<typeof User>(userRepositoryToken);
    sessionRepository = module.get<typeof Session>(sessionRepositoryToken);
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

  describe('login', () => {
    const userId = uuid.v4();
    const companyId = uuid.v4();
    const mockPayload = { email: 'test@test.com', password: 'password' };
    const mockUser = {
      id: userId,
      email: 'test@test.com',
      password: 'hashed_password',
      userSettings: { recoveryKeysFingerprint: '123456' }
    } as unknown as User;
    const mockCompanyUser = { companyId, userId } as unknown as CompanyUser;
    const mockConfirmedRegistrationHash = {
      confirmed: true,
      confirmationType: Confirmation.REGISTRATION
    } as unknown as ConfirmationHash;
    const mockUnconfirmedRegistrationHash = {
      confirmed: false,
      confirmationType: Confirmation.REGISTRATION
    } as unknown as ConfirmationHash;
    const mockMfaStatusResponse = new MfaNotSetDto();
    const mockAccessToken = 'access-token';
    const mockRefreshToken = 'refresh-token';

    it('should return tokens if login is successful with MFA code', async () => {
      jest.spyOn(usersService, 'verifyUserCredentials').mockResolvedValueOnce({
        ...mockUser,
        companyUser: mockCompanyUser,
        confirmationHashes: [mockConfirmedRegistrationHash],
        isMfaSet: true
      } as unknown as User);
      jest.spyOn(service, 'checkUserMfaStatus').mockResolvedValueOnce(null);
      jest
        .spyOn(service, 'generateTokens')
        .mockResolvedValueOnce({ _at: mockAccessToken, _rt: mockRefreshToken });

      const result = await service.login({
        payload: mockPayload
      });

      expect(result).toEqual(
        new LogInUserResponseDto({
          _rt: mockRefreshToken,
          _at: mockAccessToken
        })
      );
    }, 20000);

    it('should throw AccountNotConfirmedException if account is not confirmed', async () => {
      jest.spyOn(usersService, 'verifyUserCredentials').mockResolvedValueOnce({
        ...mockUser,
        confirmationHashes: [mockUnconfirmedRegistrationHash],
        isMfaSet: true
      } as unknown as User);

      await expect(async () => {
        await service.login({
          payload: mockPayload
        });
      }).rejects.toThrow(AccountNotConfirmedException);
    }, 20000);

    it('should return MfaNotSetDto if MFA is not set for the user', async () => {
      jest.spyOn(usersService, 'verifyUserCredentials').mockResolvedValueOnce({
        ...mockUser,
        confirmationHashes: [mockConfirmedRegistrationHash],
        isMfaSet: false
      } as unknown as User);

      const result = await service.login({
        payload: mockPayload
      });

      expect(result).toEqual(new MfaNotSetDto());
    }, 20000);

    it('should return RecoveryKeysNotSetDto if recovery keys are not set for the user', async () => {
      jest.spyOn(usersService, 'verifyUserCredentials').mockResolvedValueOnce({
        ...mockUser,
        confirmationHashes: [mockConfirmedRegistrationHash],
        isMfaSet: true,
        userSettings: { recoveryKeysFingerprint: null }
      } as unknown as User);

      const result = await service.login({
        payload: mockPayload
      });

      expect(result).toEqual(new RecoveryKeysNotSetDto());
    }, 20000);
  });

  describe('registration', () => {
    const mockPayload = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      tac: true,
      language: Language.PL
    };

    it('should successfully register a new user', async () => {
      const userId = uuid.v4();
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);
      jest
        .spyOn(cryptographicService, 'hashPassword')
        .mockResolvedValueOnce('hashed_password');
      jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValueOnce({ id: userId } as unknown as User);
      jest
        .spyOn(emailService, 'sendRegistrationConfirmationEmail')
        .mockResolvedValueOnce(null);

      const result = await service.registration({
        payload: mockPayload
      });

      expect(result).toEqual(new UserCreatedDto());
    }, 20000);

    it('should throw UserAlreadyExistsException if user already exists', async () => {
      const userId = uuid.v4();
      jest
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValueOnce({ id: userId } as unknown as User);

      await expect(async () => {
        await service.registration({
          payload: mockPayload
        });
      }).rejects.toThrow(UserAlreadyExistsException);
    }, 20000);

    it('should throw TacNotAcceptedException if TAC is not accepted', async () => {
      const payloadWithoutTac = { ...mockPayload, tac: false };

      await expect(async () => {
        await service.registration({
          payload: payloadWithoutTac
        });
      }).rejects.toThrow(TacNotAcceptedException);
    }, 20000);
  });

  describe('logout', () => {
    const mockUserId = uuid.v4();

    it('should successfully log out a user', async () => {
      jest.spyOn(sessionRepository, 'destroy').mockResolvedValueOnce(null);

      const result = await service.logout({
        userId: mockUserId
      });

      expect(result).toEqual(new LoggedOutDto());
    }, 20000);

    it('should throw an error if an error occurs during logout', async () => {
      jest
        .spyOn(sessionRepository, 'destroy')
        .mockRejectedValueOnce(new Error('Error message'));

      await expect(async () => {
        await service.logout({
          userId: mockUserId
        });
      }).rejects.toThrowError('Error message');
    }, 20000);
  });

  describe('checkUserMfaStatus', () => {
    const mockUserId = uuid.v4();
    const mockLanguage = Language.PL;
    const mockPhone = '1234567890';
    const mockUserSettings = {
      twoFaToken: 'mockTwoFaToken',
      phoneCode: '1234',
      codeSentAt: new Date(),
      phone: mockPhone
    };

    it('should return FullMfaRequiredDto if full MFA is required', async () => {
      jest
        .spyOn(phoneService, 'verifyTimeframeAndResendSmsCode')
        .mockResolvedValueOnce(null);

      const result = await service.checkUserMfaStatus({
        mfaCode: null,
        phoneCode: null,
        userSettings: {
          ...mockUserSettings,
          twoFaToken: 'mockTwoFaToken'
        } as unknown as UserSettings,
        userId: mockUserId,
        language: mockLanguage
      });

      expect(result).toEqual(new FullMfaRequiredDto());
    }, 20000);

    it('should return TokenTwoFaRequiredDto if token two-factor authentication is required', async () => {
      const result = await service.checkUserMfaStatus({
        mfaCode: null,
        phoneCode: '1234',
        userSettings: {
          ...mockUserSettings,
          twoFaToken: 'mockTwoFaToken'
        } as unknown as UserSettings,
        userId: mockUserId,
        language: mockLanguage
      });

      expect(result).toEqual(new TokenTwoFaRequiredDto());
    }, 20000);
  });
});
