import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryService } from './recovery.service';
import { Sequelize } from 'sequelize-typescript';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { UsersService } from '@modules/users.service';
import { CryptographicService } from '@shared/cryptographic.service';
import { RecoveryKeysResponseDto } from '@dto/recovery-keys.dto';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { HttpException } from '@nestjs/common';
import { AccountRecoveredDto } from '@dto/account-recovered.dto';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';

dotenv.config({ path: '.env.test' });

describe('RecoveryService', () => {
  let service: RecoveryService;
  let sequelize: Sequelize;
  let confirmationHashService: ConfirmationHashService;
  let usersService: UsersService;
  let cryptoService: CryptographicService;

  const mockConfirmationHashService = {
    getUserIdByConfirmationHash: jest.fn()
  };
  const mockUsersService = {
    updateUserSettings: jest.fn(),
    verifyUserCredentials: jest.fn(),
    getUserByRecoveryKeysFingerprint: jest.fn(),
    updateUser: jest.fn()
  };
  const mockCryptoService = {
    generateRecoveryKey: jest.fn(),
    hashPassphrase: jest.fn(),
    encryptRecoveryKeys: jest.fn(),
    hash: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecoveryService,
        {
          provide: ConfirmationHashService,
          useValue: mockConfirmationHashService
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: CryptographicService,
          useValue: mockCryptoService
        }
      ]
    }).compile();

    confirmationHashService = module.get<ConfirmationHashService>(
      ConfirmationHashService
    );
    usersService = module.get<UsersService>(UsersService);
    cryptoService = module.get<CryptographicService>(CryptographicService);
    service = module.get<RecoveryService>(RecoveryService);
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

  describe('registrationGenerateRecoveryKeys', () => {
    it('should generate and save recovery keys for registration', async () => {
      const confirmationHash = 'hash';
      const passphrase = 'passphrase';
      const userId = uuid.v4();
      const trx = await sequelize.transaction();
      const recoveryKeys = [
        'recoveryKey1',
        'recoveryKey2',
        'recoveryKey3',
        'recoveryKey4',
        'recoveryKey5'
      ];

      const registrationKeysInterface = {
        confirmationHash,
        payload: { passphrase },
        trx
      };

      mockConfirmationHashService.getUserIdByConfirmationHash.mockResolvedValueOnce(
        { userId }
      );
      mockCryptoService.generateRecoveryKey.mockReturnValueOnce(recoveryKeys);
      mockCryptoService.hashPassphrase.mockReturnValueOnce('hashedPassphrase');
      mockCryptoService.encryptRecoveryKeys.mockReturnValueOnce(
        'encryptedRecoveryKeys'
      );
      mockCryptoService.hash.mockReturnValueOnce('recoveryKeysFingerprint');

      const expectedResult = new RecoveryKeysResponseDto(recoveryKeys);

      const result = await service.registrationGenerateRecoveryKeys(
        registrationKeysInterface
      );

      expect(
        mockConfirmationHashService.getUserIdByConfirmationHash
      ).toHaveBeenCalledWith({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });
      expect(mockCryptoService.generateRecoveryKey).toHaveBeenCalled();
      expect(mockCryptoService.hashPassphrase).toHaveBeenCalledWith({
        passphrase
      });
      expect(mockCryptoService.encryptRecoveryKeys).toHaveBeenCalledWith({
        recoveryKeys,
        hashedPassphrase: 'hashedPassphrase'
      });
      expect(mockCryptoService.hash).toHaveBeenCalledWith({
        data: 'encryptedRecoveryKeys',
        algorithm: CryptoHashAlgorithm.SHA512
      });
      expect(mockUsersService.updateUserSettings).toHaveBeenCalledWith({
        payload: { recoveryKeysFingerprint: 'recoveryKeysFingerprint' },
        userId,
        trx
      });
      expect(result).toEqual(expectedResult);
    }, 20009);

    it('should throw HttpException if an error occurs during the process', async () => {
      const confirmationHash = 'hash';
      const passphrase = 'passphrase';
      const trx: any = {};

      const registrationKeysInterface = {
        confirmationHash,
        payload: { passphrase },
        trx
      };

      mockConfirmationHashService.getUserIdByConfirmationHash.mockResolvedValueOnce(
        { userId: uuid.v4() }
      );
      mockCryptoService.generateRecoveryKey.mockImplementationOnce(() => {
        throw new HttpException('Error generating recovery key', 500);
      });

      await expect(
        service.registrationGenerateRecoveryKeys(registrationKeysInterface)
      ).rejects.toThrowError(HttpException);

      expect(
        mockConfirmationHashService.getUserIdByConfirmationHash
      ).toHaveBeenCalledWith({
        confirmationHash,
        confirmationType: Confirmation.REGISTRATION,
        trx
      });
      expect(mockCryptoService.generateRecoveryKey).toHaveBeenCalled();
    }, 20000);
  });

  describe('loginGenerateRecoveryKeys', () => {
    it('should generate and save recovery keys for login', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'password',
        passphrase: 'passphrase'
      };
      const recoveryKeys = [
        'recoveryKey1',
        'recoveryKey2',
        'recoveryKey3',
        'recoveryKey4',
        'recoveryKey5'
      ];
      const userId = uuid.v4();
      const trx = await sequelize.transaction();

      const loginKeysInterface = {
        payload,
        trx
      };

      mockUsersService.verifyUserCredentials.mockResolvedValueOnce({
        id: userId
      });
      const generateAndSaveRecoveryKeysMock = jest.spyOn(
        service,
        'generateAndSaveRecoveryKeys'
      );

      const expectedResult = new RecoveryKeysResponseDto(recoveryKeys);
      generateAndSaveRecoveryKeysMock.mockResolvedValueOnce(expectedResult);

      const result =
        await service.loginGenerateRecoveryKeys(loginKeysInterface);

      expect(mockUsersService.verifyUserCredentials).toHaveBeenCalledWith({
        email: payload.email,
        password: payload.password,
        trx
      });
      expect(generateAndSaveRecoveryKeysMock).toHaveBeenCalledWith({
        passphrase: payload.passphrase,
        userId,
        trx
      });
      expect(result).toEqual(expectedResult);
    }, 20000);

    it('should throw HttpException if an error occurs during the process', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'password',
        passphrase: 'passphrase'
      };
      const trx = await sequelize.transaction();

      const loginKeysInterface = {
        payload,
        trx
      };

      mockUsersService.verifyUserCredentials.mockImplementationOnce(() => {
        throw new HttpException('Error verifying user credentials', 500);
      });

      await expect(
        service.loginGenerateRecoveryKeys(loginKeysInterface)
      ).rejects.toThrowError(HttpException);

      expect(mockUsersService.verifyUserCredentials).toHaveBeenCalledWith({
        email: payload.email,
        password: payload.password,
        trx
      });
    }, 20000);
  });

  describe('recoverUserAccount', () => {
    it('should recover user account', async () => {
      const recoveryKeys = [
        'recoveryKey1',
        'recoveryKey2',
        'recoveryKey3',
        'recoveryKey4',
        'recoveryKey5'
      ];
      const payload = {
        passphrase: 'passphrase',
        recoveryKeys
      };
      const trx = await sequelize.transaction();
      const userId = uuid.v4();
      const userSettings = {
        recoveryKeysFingerprint: 'recoveryKeysFingerprint'
      };

      const recoverAccountInterface = {
        payload,
        trx
      };

      mockCryptoService.hashPassphrase.mockReturnValueOnce('hashedPassphrase');
      mockCryptoService.encryptRecoveryKeys.mockReturnValueOnce(
        'encryptedRecoveryKeys'
      );
      mockCryptoService.hash.mockReturnValueOnce('recoveryKeysFingerprint');

      mockUsersService.getUserByRecoveryKeysFingerprint.mockResolvedValueOnce({
        id: userId,
        userSettings
      });

      const result = await service.recoverUserAccount(recoverAccountInterface);

      expect(mockCryptoService.hashPassphrase).toHaveBeenCalledWith({
        passphrase: payload.passphrase
      });
      expect(mockCryptoService.encryptRecoveryKeys).toHaveBeenCalledWith({
        recoveryKeys: payload.recoveryKeys,
        hashedPassphrase: 'hashedPassphrase'
      });
      expect(mockCryptoService.hash).toHaveBeenCalledWith({
        data: 'encryptedRecoveryKeys',
        algorithm: 'SHA512'
      });
      expect(
        mockUsersService.getUserByRecoveryKeysFingerprint
      ).toHaveBeenCalledWith({
        recoveryKeysFingerprint: 'recoveryKeysFingerprint',
        trx
      });
      expect(mockUsersService.updateUserSettings).toHaveBeenCalledWith({
        payload: {
          phone: null,
          phoneCode: null,
          codeSentAt: null,
          twoFaToken: null,
          recoveryKeysFingerprint: null
        },
        userId,
        trx
      });
      expect(mockUsersService.updateUser).toHaveBeenCalledWith({
        payload: { isMfaSet: false },
        userId,
        trx
      });
      expect(result).toBeInstanceOf(AccountRecoveredDto);
    }, 20000);

    it('should throw WrongRecoveryKeysException if recovery keys fingerprint does not match', async () => {
      const recoveryKeys = [
        'recoveryKey1',
        'recoveryKey2',
        'recoveryKey3',
        'recoveryKey4',
        'recoveryKey5'
      ];
      const payload = {
        passphrase: 'passphrase',
        recoveryKeys
      };
      const trx = await sequelize.transaction();
      const userId = uuid.v4();
      const userSettings = {
        recoveryKeysFingerprint: 'differentRecoveryKeysFingerprint'
      };

      const recoverAccountInterface = {
        payload,
        trx
      };

      mockCryptoService.hashPassphrase.mockReturnValueOnce('hashedPassphrase');
      mockCryptoService.encryptRecoveryKeys.mockReturnValueOnce(
        'encryptedRecoveryKeys'
      );
      mockCryptoService.hash.mockReturnValueOnce('recoveryKeysFingerprint');

      mockUsersService.getUserByRecoveryKeysFingerprint.mockResolvedValueOnce({
        id: userId,
        userSettings
      });

      await expect(
        service.recoverUserAccount(recoverAccountInterface)
      ).rejects.toThrowError(WrongRecoveryKeysException);

      expect(mockCryptoService.hashPassphrase).toHaveBeenCalledWith({
        passphrase: payload.passphrase
      });
      expect(mockCryptoService.encryptRecoveryKeys).toHaveBeenCalledWith({
        recoveryKeys: payload.recoveryKeys,
        hashedPassphrase: 'hashedPassphrase'
      });
      expect(mockCryptoService.hash).toHaveBeenCalledWith({
        data: 'encryptedRecoveryKeys',
        algorithm: 'SHA512'
      });
      expect(
        mockUsersService.getUserByRecoveryKeysFingerprint
      ).toHaveBeenCalledWith({
        recoveryKeysFingerprint: 'recoveryKeysFingerprint',
        trx
      });
    }, 20000);
  });
});
