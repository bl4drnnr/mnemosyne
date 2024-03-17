import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationHashController } from './confirmation-hash.controller';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { Language } from '@interfaces/language.enum';
import { ConfirmCompanyAccDto } from '@dto/confirm-company-acc.dto';
import { ConfirmEmailChangeDto } from '@dto/confirm-email-change.dto';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';

dotenv.config({ path: '.env.test' });

describe('ConfirmationHashController', () => {
  let controller: ConfirmationHashController;
  let confirmationHashService: ConfirmationHashService;

  const mockConfirmationHashService = {
    confirmAccount: jest.fn().mockImplementation(() => {
      return;
    }),
    confirmCompanyAccount: jest.fn().mockImplementation(() => {
      return;
    }),
    companyMemberAccountConfirmation: jest.fn().mockImplementation(() => {
      return;
    }),
    confirmEmailChange: jest.fn().mockImplementation(() => {
      return;
    }),
    confirmResetUserPassword: jest.fn().mockImplementation(() => {
      return;
    })
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
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('confirmAccount', () => {
    it('Should call confirmAccount method with correct parameters', async () => {
      const trx: any = {};
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

  describe('confirmCompanyAccount', () => {
    it('Should call confirmCompanyAccount method with correct parameters', async () => {
      const trx: any = {};
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

  describe('companyMemberAccountConfirmation', () => {
    it('Should call companyMemberAccountConfirmation method with correct parameters', async () => {
      const trx: any = {};
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

  describe('confirmEmailChange', () => {
    it('Should call confirmEmailChange method with correct parameters', async () => {
      const confirmationHash = 'test-confirmation-hash';
      const payload: ConfirmEmailChangeDto = {
        password: '12qw!@QW',
        mfaCode: '123123',
        phoneCode: '123123',
        language: Language.PL
      };
      const trx: any = {};

      await controller.confirmEmailChange(confirmationHash, payload, trx);

      expect(confirmationHashService.confirmEmailChange).toHaveBeenCalledWith({
        confirmationHash,
        payload,
        trx
      });
    }, 20000);
  });

  describe('confirmResetUserPassword', () => {
    it('Should call confirmResetUserPassword method with correct parameters', async () => {
      const confirmationHash = 'test-confirmation-hash';
      const payload: ResetUserPasswordDto = {
        password: '12qw!@QW',
        mfaCode: '123123',
        phoneCode: '123123',
        language: Language.PL
      };
      const trx: any = {};

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
