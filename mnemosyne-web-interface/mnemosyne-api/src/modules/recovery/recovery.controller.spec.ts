import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryController } from './recovery.controller';
import { AuthGuard } from '@guards/auth.guard';
import { RecoveryService } from '@modules/recovery.service';
import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { Sequelize } from 'sequelize-typescript';
import { LoginGenerateRecoveryKeysDto } from '@dto/login-generate-recovery-keys.dto';
import { RegistrationKeysInterface } from '@interfaces/registration-keys.interface';
import { LoginKeysInterface } from '@interfaces/login-keys.interface';
import { GenerateKeysInterface } from '@interfaces/generate-keys.interface';
import { RecoverAccountInterface } from '@interfaces/recover-account.interface';
import { RecoverAccountDto } from '@dto/recover-account.dto';

dotenv.config({ path: '.env.test' });

describe('RecoveryController', () => {
  let controller: RecoveryController;
  let recoveryService: RecoveryService;
  let sequelize: Sequelize;

  const mockRecoveryService = {
    registrationGenerateRecoveryKeys: jest
      .fn()
      .mockImplementation(
        ({ confirmationHash, payload, trx }: RegistrationKeysInterface) => {
          return;
        }
      ),
    loginGenerateRecoveryKeys: jest
      .fn()
      .mockImplementation(({ payload, trx }: LoginKeysInterface) => {
        return;
      }),
    generateRecoveryKeys: jest
      .fn()
      .mockImplementation(({ payload, userId, trx }: GenerateKeysInterface) => {
        return;
      }),
    recoverUserAccount: jest
      .fn()
      .mockImplementation(({ payload, trx }: RecoverAccountInterface) => {
        return;
      })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoveryController],
      providers: [
        {
          provide: RecoveryService,
          useValue: mockRecoveryService
        }
      ]
    })
      .overrideProvider(RecoveryService)
      .useValue(mockRecoveryService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<RecoveryController>(RecoveryController);
    recoveryService = module.get<RecoveryService>(RecoveryService);
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

  describe('Registration Generate Recovery Keys', () => {
    it('Should call registrationGenerateRecoveryKeys method with correct parameters', async () => {
      const confirmationHash = 'testConfirmationHash';
      const payload: GenerateRecoveryKeysDto = { passphrase: '123123123' };
      const trx = await sequelize.transaction();

      await controller.registrationGenerateRecoveryKeys(
        confirmationHash,
        payload,
        trx
      );

      expect(
        recoveryService.registrationGenerateRecoveryKeys
      ).toHaveBeenCalledWith({
        confirmationHash,
        payload,
        trx
      });
    }, 20000);
  });

  describe('Login Generate Recovery Keys', () => {
    it('Should call loginGenerateRecoveryKeys with correct parameters', async () => {
      const payload: LoginGenerateRecoveryKeysDto = {
        passphrase: '123123123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx = await sequelize.transaction();

      await controller.loginGenerateRecoveryKeys(payload, trx);

      expect(recoveryService.loginGenerateRecoveryKeys).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Generate Recovery Keys', () => {
    it('Should call generateRecoveryKeys with correct parameters', async () => {
      const payload: GenerateRecoveryKeysDto = { passphrase: '123123123' };
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.generateRecoveryKeys(payload, userId, trx);

      expect(recoveryService.generateRecoveryKeys).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('Recover Account', () => {
    it('Should call recoverUserAccount with correct parameters', async () => {
      const payload: RecoverAccountDto = {
        passphrase: '123123123',
        recoveryKeys: ['1', '2', '3', '4', '5']
      };
      const trx = await sequelize.transaction();

      await controller.recoverUserAccount(payload, trx);

      expect(recoveryService.recoverUserAccount).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });
});
