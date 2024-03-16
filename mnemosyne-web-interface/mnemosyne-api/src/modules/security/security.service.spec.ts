import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import * as node2fa from 'node-2fa';
import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { CryptographicService } from '@shared/cryptographic.service';
import { UsersService } from '@modules/users.service';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { QrCodeDto } from '@dto/qr-code.dto';
import { PhoneService } from '@shared/phone.service';
import { AuthService } from '@modules/auth.service';
import { TimeService } from '@shared/time.service';
import { EmailService } from '@shared/email.service';
import { HttpException } from '@nestjs/common';

dotenv.config({ path: '.env.test' });

describe('SecurityService', () => {
  let service: SecurityService;
  let confirmationHashService: ConfirmationHashService;
  let cryptographicService: CryptographicService;
  let phoneService: PhoneService;
  let authService: AuthService;
  let timeService: TimeService;
  let emailService: EmailService;
  let usersService: UsersService;

  const mockConfirmationHashService = {
    getUserIdByConfirmationHash: jest.fn()
  };
  const mockCryptographicService = {};
  const mockPhoneService = {};
  const mockAuthService = {};
  const mockTimeService = {};
  const mockEmailService = {};
  const mockUsersService = {
    getUserById: jest.fn(),
    verifyUserCredentials: jest.fn(),
    updateUser: jest.fn(),
    updateUserSettings: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: ConfirmationHashService,
          useValue: mockConfirmationHashService
        },
        {
          provide: CryptographicService,
          useValue: mockCryptographicService
        },
        {
          provide: PhoneService,
          useValue: mockPhoneService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: TimeService,
          useValue: mockTimeService
        },
        {
          provide: EmailService,
          useValue: mockEmailService
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ]
    }).compile();

    service = module.get<SecurityService>(SecurityService);
    confirmationHashService = module.get<ConfirmationHashService>(
      ConfirmationHashService
    );
    cryptographicService =
      module.get<CryptographicService>(CryptographicService);
    phoneService = module.get<PhoneService>(PhoneService);
    authService = module.get<AuthService>(AuthService);
    timeService = module.get<TimeService>(TimeService);
    emailService = module.get<EmailService>(EmailService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registrationGenerateTwoFaQrCode', () => {
    it('should generate 2FA QR code for registration', async () => {
      const confirmationHash = 'confirmation-hash';
      const userId = uuid.v4();
      const email = 'test@example.com';
      const qrCodeData = {
        qr: 'qr-code-data',
        secret: 'secret-key',
        uri: 'uri'
      };

      const registrationGenerate2faInterface = {
        confirmationHash,
        trx: null
      };

      mockConfirmationHashService.getUserIdByConfirmationHash.mockResolvedValueOnce(
        { userId }
      );
      mockUsersService.getUserById.mockResolvedValueOnce({ email });

      jest.spyOn(node2fa, 'generateSecret').mockReturnValueOnce(qrCodeData);

      const result = await service.registrationGenerateTwoFaQrCode(
        registrationGenerate2faInterface
      );

      expect(
        mockConfirmationHashService.getUserIdByConfirmationHash
      ).toHaveBeenCalledWith({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx: null
      });
      expect(mockUsersService.getUserById).toHaveBeenCalledWith({
        id: userId,
        trx: null
      });
      expect(node2fa.generateSecret).toHaveBeenCalledWith({
        name: 'Mnemosyne',
        account: email
      });
      expect(result).toEqual(new QrCodeDto(qrCodeData));
    }, 20000);
  });

  describe('loginGenerateTwoFaQrCode', () => {
    it('should generate 2FA QR code for login', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const qrCodeData = {
        qr: 'qr-code-data',
        secret: 'secret-key',
        uri: 'uri'
      };

      const loginGenerate2faInterface = {
        payload: { email, password },
        trx: null
      };

      mockUsersService.verifyUserCredentials.mockResolvedValueOnce(null);
      jest.spyOn(node2fa, 'generateSecret').mockReturnValueOnce(qrCodeData);

      const result = await service.loginGenerateTwoFaQrCode(
        loginGenerate2faInterface
      );

      expect(mockUsersService.verifyUserCredentials).toHaveBeenCalledWith({
        email,
        password,
        trx: null
      });
      expect(node2fa.generateSecret).toHaveBeenCalledWith({
        name: 'Mnemosyne',
        account: email
      });
      expect(result).toEqual(new QrCodeDto(qrCodeData));
    }, 20000);
  });

  describe('generateTwoFaQrCode', () => {
    it('should generate 2FA QR code', async () => {
      const userId = uuid.v4();
      const email = 'test@example.com';
      const qrCodeData = {
        qr: 'qr-code-data',
        secret: 'secret-key',
        uri: 'uri'
      };

      const generate2faInterface = {
        userId,
        trx: null
      };

      mockUsersService.getUserById.mockResolvedValueOnce({ email });
      jest.spyOn(node2fa, 'generateSecret').mockReturnValueOnce(qrCodeData);

      const result = await service.generateTwoFaQrCode(generate2faInterface);

      expect(mockUsersService.getUserById).toHaveBeenCalledWith({
        id: userId,
        trx: null
      });
      expect(node2fa.generateSecret).toHaveBeenCalledWith({
        name: 'Mnemosyne',
        account: email
      });
      expect(result).toEqual(new QrCodeDto(qrCodeData));
    });
  });

  describe('registrationVerifyTwoFaQrCode', () => {
    it('should verify 2FA QR code and set MFA status', async () => {
      const userId = uuid.v4();
      const code = '123123';
      const twoFaToken = '2fa-token';
      const confirmationHash = 'confirmation-hash';

      const verifyQrCodeInterface = {
        userId,
        code,
        twoFaToken,
        trx: null
      };

      mockConfirmationHashService.getUserIdByConfirmationHash.mockResolvedValueOnce(
        { userId }
      );
      jest.spyOn(node2fa, 'verifyToken').mockReturnValueOnce({ delta: 0 });

      await service.registrationVerifyTwoFaQrCode({
        payload: { code, twoFaToken },
        confirmationHash,
        trx: null
      });

      expect(
        mockConfirmationHashService.getUserIdByConfirmationHash
      ).toHaveBeenCalledWith({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx: null
      });
      expect(node2fa.verifyToken).toHaveBeenCalledWith(twoFaToken, code);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith({
        payload: { isMfaSet: true },
        userId,
        trx: null
      });
      expect(mockUsersService.updateUserSettings).toHaveBeenCalledWith({
        payload: { twoFaToken },
        userId,
        trx: null
      });
    });

    it('should throw WrongCodeException when verification fails', async () => {
      const userId = uuid.v4;
      const code = '123123';
      const twoFaToken = '2fa-token';
      const confirmationHash = 'confirmation-hash';

      mockConfirmationHashService.getUserIdByConfirmationHash.mockResolvedValueOnce(
        { userId }
      );
      jest.spyOn(node2fa, 'verifyToken').mockReturnValueOnce({ delta: 1 });

      await expect(
        service.registrationVerifyTwoFaQrCode({
          payload: { code, twoFaToken },
          confirmationHash,
          trx: null
        })
      ).rejects.toThrowError(HttpException);
    });
  });
});
