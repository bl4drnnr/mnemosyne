import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationHashController } from './confirmation-hash.controller';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { Sequelize } from 'sequelize-typescript';
import { Language } from '@interfaces/language.enum';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { ConfirmAccountInterface } from '@interfaces/confirm-account.interface';
import { ConfirmCompanyAccInterface } from '@interfaces/confirm-company-acc.interface';
import { ConfirmEmailInterface } from '@interfaces/confirm-email.interface';
import { ConfirmPasswordResetInterface } from '@interfaces/confirm-password-reset.interface';

dotenv.config({ path: '.env.test' });

describe('ConfirmationHashController', () => {
  let controller: ConfirmationHashController;
  let confirmationHashService: ConfirmationHashService;
  let sequelize: Sequelize;

  const mockConfirmationHashService = {
    confirmAccount: jest
      .fn()
      .mockImplementation(
        ({ confirmationHash, language, trx }: ConfirmAccountInterface) => {
          return;
        }
      ),
    confirmCompanyAccount: jest
      .fn()
      .mockImplementation(
        ({ payload, confirmationHash, trx }: ConfirmCompanyAccInterface) => {
          return;
        }
      ),
    companyMemberAccountConfirmation: jest
      .fn()
      .mockImplementation(
        ({ payload, confirmationHash, trx }: ConfirmCompanyAccInterface) => {
          return;
        }
      ),
    confirmEmailChange: jest
      .fn()
      .mockImplementation(
        ({ confirmationHash, payload, trx }: ConfirmEmailInterface) => {
          return;
        }
      ),
    confirmResetUserPassword: jest
      .fn()
      .mockImplementation(
        ({ hash, payload, trx }: ConfirmPasswordResetInterface) => {
          return;
        }
      )
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmationHashController],
      providers: [
        {
          provide: ConfirmationHashService,
          useValue: mockConfirmationHashService
        }
      ]
    })
      .overrideProvider(confirmationHashService)
      .useValue(mockConfirmationHashService)
      .compile();

    controller = module.get<ConfirmationHashController>(
      ConfirmationHashController
    );
    confirmationHashService = module.get<ConfirmationHashService>(
      ConfirmationHashService
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
    expect(controller).toBeDefined();
  });

  describe('Account Confirmation', () => {
    it('Should call confirmAccount method with correct parameters', async () => {
      const trx = await sequelize.transaction();
      const confirmationHash = 'test-confirmation-hash';
      const language = Language.PL;

      await controller.confirmAccount(trx, confirmationHash, language);

      expect(confirmationHashService.confirmAccount).toHaveBeenCalledWith({
        trx,
        confirmationHash,
        language
      });
    }, 20000);
  });

  describe('Company Account Confirmation', () => {
    it('Should call confirmCompanyAccount method with correct parameters', async () => {
      const trx = await sequelize.transaction();
      const payload: ConfirmCompanyAccDto = {
        firstName: 'Jon',
        lastName: 'Doe',
        password: '12qw!@QW',
        language: Language.PL
      };
      const confirmationHash = 'test-confirmation-hash';

      await controller.confirmCompanyAccount(trx, payload, confirmationHash);

      expect(
        confirmationHashService.confirmCompanyAccount
      ).toHaveBeenCalledWith({
        trx,
        payload,
        confirmationHash
      });
    }, 20000);
  });

  describe('Company Member Account Confirmation', () => {
    it('Should call companyMemberAccountConfirmation method with correct parameters', async () => {
      const trx = await sequelize.transaction();
      const payload: ConfirmCompanyAccDto = {
        firstName: 'Jon',
        lastName: 'Doe',
        password: '12qw!@QW',
        language: Language.PL
      };
      const confirmationHash = 'test-confirmation-hash';

      await controller.companyMemberAccountConfirmation(
        trx,
        payload,
        confirmationHash
      );

      expect(
        confirmationHashService.companyMemberAccountConfirmation
      ).toHaveBeenCalledWith({
        trx,
        payload,
        confirmationHash
      });
    }, 20000);
  });

  describe('Email Change Confirmation', () => {
    it('Should call confirmEmailChange method with correct parameters', async () => {
      const confirmationHash = 'test-confirmation-hash';
      const payload: ConfirmEmailChangeDto = {
        password: '12qw!@QW',
        mfaCode: '123123',
        phoneCode: '123123',
        language: Language.PL
      };
      const trx = await sequelize.transaction();

      await controller.confirmEmailChange(confirmationHash, payload, trx);

      expect(confirmationHashService.confirmEmailChange).toHaveBeenCalledWith({
        confirmationHash,
        payload,
        trx
      });
    }, 20000);
  });

  describe('Reset User Password Confirmation', () => {
    it('Should call confirmResetUserPassword method with correct parameters', async () => {
      const confirmationHash = 'test-confirmation-hash';
      const payload: ResetUserPasswordDto = {
        password: '12qw!@QW',
        mfaCode: '123123',
        phoneCode: '123123',
        language: Language.PL
      };
      const trx = await sequelize.transaction();

      await controller.confirmResetUserPassword(confirmationHash, payload, trx);

      expect(
        confirmationHashService.confirmResetUserPassword
      ).toHaveBeenCalledWith({
        hash: confirmationHash,
        payload,
        trx
      });
    }, 20000);
  });
});
