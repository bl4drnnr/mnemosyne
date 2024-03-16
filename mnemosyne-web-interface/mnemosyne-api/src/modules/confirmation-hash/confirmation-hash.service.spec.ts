import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationHashService } from './confirmation-hash.service';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { CryptographicService } from '@shared/cryptographic.service';
import { CompanyService } from '@modules/company.service';
import { TimeService } from '@shared/time.service';
import { EmailService } from '@shared/email.service';
import { AuthService } from '@modules/auth.service';
import { UsersService } from '@modules/users.service';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { ApiConfigService } from '@shared/config.service';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';

dotenv.config({ path: '.env.test' });

describe('ConfirmationHashService', () => {
  let service: ConfirmationHashService;
  let sequelize: Sequelize;
  let cryptographicService: CryptographicService;
  let timeService: TimeService;
  let companyService: CompanyService;
  let emailService: EmailService;
  let authService: AuthService;
  let usersService: UsersService;
  let confirmationHashRepository: typeof ConfirmationHash;

  const confirmationHashRepositoryToken = getModelToken(ConfirmationHash);

  const mockCryptographicService = {};
  const mockTimeService = {};
  const mockCompanyService = {};
  const mockEmailService = {};
  const mockAuthService = {};
  const mockUsersService = {
    getUserById: jest.fn()
  };
  const mockConfirmationHashRepository = {
    create: jest.fn(),
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmationHashService,
        ApiConfigService,
        ConfigService,
        { provide: CryptographicService, useValue: mockCryptographicService },
        { provide: TimeService, useValue: mockTimeService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: EmailService, useValue: mockEmailService },
        {
          provide: confirmationHashRepositoryToken,
          useValue: mockConfirmationHashRepository
        }
      ]
    }).compile();

    service = module.get<ConfirmationHashService>(ConfirmationHashService);
    cryptographicService =
      module.get<CryptographicService>(CryptographicService);
    timeService = module.get<TimeService>(TimeService);
    companyService = module.get<CompanyService>(CompanyService);
    emailService = module.get<EmailService>(EmailService);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    confirmationHashRepository = module.get<typeof ConfirmationHash>(
      confirmationHashRepositoryToken
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

  describe('createConfirmationHash', () => {
    it('should create confirmation hash with the given payload', async () => {
      const userId = uuid.v4();
      const confirmationType = Confirmation.REGISTRATION;
      const confirmationHash = 'confirmation-hash';
      const changingEmail = '';
      const payload = {
        userId,
        confirmationType,
        confirmationHash,
        changingEmail
      };
      const trx = await sequelize.transaction();

      await service.createConfirmationHash({ payload, trx });

      expect(mockConfirmationHashRepository.create).toHaveBeenCalledWith(
        {
          userId,
          confirmationType,
          confirmationHash,
          changingEmail
        },
        { transaction: trx }
      );
    }, 20000);
  });

  describe('getUserIdByConfirmationHash', () => {
    it('should return userId for the given confirmation hash', async () => {
      const confirmationHash = 'hash';
      const userId = uuid.v4();
      const trx = await sequelize.transaction();
      const getByHashInterface = {
        confirmationHash,
        trx
      };
      const foundHash = {
        userId
      };
      jest
        .spyOn(mockConfirmationHashRepository, 'findOne')
        .mockResolvedValueOnce(foundHash);

      const result =
        await service.getUserIdByConfirmationHash(getByHashInterface);

      expect(mockConfirmationHashRepository.findOne).toHaveBeenCalledWith({
        rejectOnEmpty: undefined,
        where: { confirmationHash },
        transaction: trx
      });
      expect(result).toEqual({ userId });
    });

    it('should throw HashNotFoundException if confirmation hash is not found', async () => {
      const confirmationHash = 'hash';
      const trx = await sequelize.transaction();
      const getByHashInterface = {
        confirmationHash,
        trx
      };
      mockConfirmationHashRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getUserIdByConfirmationHash(getByHashInterface)
      ).rejects.toThrowError(HashNotFoundException);

      expect(mockConfirmationHashRepository.findOne).toHaveBeenCalledWith({
        rejectOnEmpty: undefined,
        where: { confirmationHash },
        transaction: trx
      });
    });
  });

  describe('getUserByConfirmationHash', () => {
    it('should return user and found hash for the given confirmation hash', async () => {
      const confirmationHash = 'hash';
      const confirmationType = Confirmation.REGISTRATION;
      const userId = uuid.v4();
      const trx = await sequelize.transaction();
      const getByHashInterface = {
        confirmationHash,
        confirmationType,
        trx
      };
      const foundHash = {
        userId
      };
      const user = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockConfirmationHashRepository.findOne.mockResolvedValue(foundHash);
      mockUsersService.getUserById.mockResolvedValue(user);

      const result =
        await service.getUserByConfirmationHash(getByHashInterface);

      expect(mockUsersService.getUserById).toHaveBeenCalledWith({
        id: userId
      });
      expect(result).toEqual({ foundHash, user });
    });

    it('should throw HashNotFoundException if confirmation hash is not found', async () => {
      const confirmationHash = 'non-existing-hash';
      const confirmationType = Confirmation.REGISTRATION;
      const trx = await sequelize.transaction();
      const getByHashInterface = {
        confirmationHash,
        confirmationType,
        trx
      };
      mockConfirmationHashRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getUserByConfirmationHash(getByHashInterface)
      ).rejects.toThrowError(HashNotFoundException);
    });
  });
});
