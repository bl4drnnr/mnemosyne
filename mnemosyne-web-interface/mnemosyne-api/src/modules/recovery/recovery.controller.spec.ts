import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryController } from './recovery.controller';
import { AuthGuard } from '@guards/auth.guard';
import { RecoveryService } from '@modules/recovery.service';
import {GenerateRecoveryKeysDto} from "@dto/generate-recovery-keys.dto";
import {Sequelize} from "sequelize-typescript";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' })

describe('RecoveryController', () => {
  let controller: RecoveryController;
  let recoveryService: RecoveryService;
  let sequelize: Sequelize;

  const mockRecoveryService = {
    registrationGenerateRecoveryKeys: jest.fn().mockImplementation(() => {
      return ;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoveryController],
      providers: [
        {
          provide: RecoveryService,
          useValue: mockRecoveryService,
        },
      ],
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

  describe('registrationGenerateRecoveryKeys', () => {
    it('should call registrationGenerateRecoveryKeys method with correct parameters', async () => {
      const confirmationHash = 'testConfirmationHash';
      const payload: GenerateRecoveryKeysDto = { passphrase: '123123123' };
      const trx = await sequelize.transaction();

      await controller.registrationGenerateRecoveryKeys(confirmationHash, payload, trx);

      expect(recoveryService.registrationGenerateRecoveryKeys).toHaveBeenCalledWith({
        confirmationHash,
        payload,
        trx,
      });
    });
  });

  describe('loginenerate-recovery-keys', () => {
    it('', async () => {

    })
  })
});
