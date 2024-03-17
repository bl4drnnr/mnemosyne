import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryController } from './recovery.controller';
import { AuthGuard } from '@guards/auth.guard';
import { RecoveryService } from '@modules/recovery.service';
import { GenerateRecoveryKeysDto } from '@dto/generate-recovery-keys.dto';
import { LoginGenerateRecoveryKeysDto } from '@dto/login-generate-recovery-keys.dto';
import { RecoverAccountDto } from '@dto/recover-account.dto';

dotenv.config({ path: '.env.test' });

describe('RecoveryController', () => {
  let controller: RecoveryController;
  let recoveryService: RecoveryService;

  const mockRecoveryService = {
    registrationGenerateRecoveryKeys: jest.fn().mockImplementation(() => {
      return;
    }),
    loginGenerateRecoveryKeys: jest.fn().mockImplementation(() => {
      return;
    }),
    generateRecoveryKeys: jest.fn().mockImplementation(() => {
      return;
    }),
    recoverUserAccount: jest.fn().mockImplementation(() => {
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
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registrationGenerateRecoveryKeys', () => {
    it('Should call registrationGenerateRecoveryKeys method with correct parameters', async () => {
      const confirmationHash = 'testConfirmationHash';
      const payload: GenerateRecoveryKeysDto = { passphrase: '123123123' };
      const trx: any = {};

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

  describe('loginGenerateRecoveryKeys', () => {
    it('Should call loginGenerateRecoveryKeys with correct parameters', async () => {
      const payload: LoginGenerateRecoveryKeysDto = {
        passphrase: '123123123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx: any = {};

      await controller.loginGenerateRecoveryKeys(payload, trx);

      expect(recoveryService.loginGenerateRecoveryKeys).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('generateRecoveryKeys', () => {
    it('Should call generateRecoveryKeys with correct parameters', async () => {
      const payload: GenerateRecoveryKeysDto = { passphrase: '123123123' };
      const userId = uuid.v4();
      const trx: any = {};

      await controller.generateRecoveryKeys(payload, userId, trx);

      expect(recoveryService.generateRecoveryKeys).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('recoverUserAccount', () => {
    it('Should call recoverUserAccount with correct parameters', async () => {
      const payload: RecoverAccountDto = {
        passphrase: '123123123',
        recoveryKeys: ['1', '2', '3', '4', '5']
      };
      const trx: any = {};

      await controller.recoverUserAccount(payload, trx);

      expect(recoveryService.recoverUserAccount).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });
});
