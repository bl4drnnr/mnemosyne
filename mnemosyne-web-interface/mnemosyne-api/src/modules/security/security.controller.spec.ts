import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { SecurityController } from './security.controller';
import { AuthGuard } from '@guards/auth.guard';
import { SecurityService } from '@modules/security.service';
import { LoginGenerate2faQrDto } from '@dto/login-generate-2fa-qr.dto';
import { VerifyTwoFaDto } from '@dto/verify-two-fa.dto';
import { DisableTwoFaDto } from '@dto/disable-two-fa.dto';
import { RegistrationSendSmsCodeDto } from '@dto/registration-send-sms-code.dto';
import { Language } from '@interfaces/language.enum';
import { LoginSendSmsDto } from '@dto/login-send-sms.dto';
import { VerifyMobilePhoneDto } from '@dto/verify-mobile-phone.dto';
import { DeleteAccountDto } from '@dto/delete-account.dto';
import { ChangePasswordDto } from '@dto/change-password.dto';
import { ChangeEmailDto } from '@dto/change-email.dto';

dotenv.config({ path: '.env.test' });

describe('SecurityController', () => {
  let controller: SecurityController;
  let securityService: SecurityService;

  const mockSecurityService = {
    registrationGenerateTwoFaQrCode: jest.fn().mockImplementation(() => {
      return;
    }),
    loginGenerateTwoFaQrCode: jest.fn().mockImplementation(() => {
      return;
    }),
    generateTwoFaQrCode: jest.fn().mockImplementation(() => {
      return;
    }),
    registrationVerifyTwoFaQrCode: jest.fn().mockImplementation(() => {
      return;
    }),
    loginVerifyTwoFaQrCode: jest.fn().mockImplementation(() => {
      return;
    }),
    verifyTwoFaQrCode: jest.fn().mockImplementation(() => {
      return;
    }),
    disableTwoFa: jest.fn().mockImplementation(() => {
      return;
    }),
    registrationSendSmsCode: jest.fn().mockImplementation(() => {
      return;
    }),
    loginSendSmsCode: jest.fn().mockImplementation(() => {
      return;
    }),
    sendSmsCode: jest.fn().mockImplementation(() => {
      return;
    }),
    hashSendSmsCode: jest.fn().mockImplementation(() => {
      return;
    }),
    getSmsCode: jest.fn().mockImplementation(() => {
      return;
    }),
    clearSmsCode: jest.fn().mockImplementation(() => {
      return;
    }),
    registrationVerifyMobilePhone: jest.fn().mockImplementation(() => {
      return;
    }),
    loginVerifyMobilePhone: jest.fn().mockImplementation(() => {
      return;
    }),
    verifyMobilePhone: jest.fn().mockImplementation(() => {
      return;
    }),
    disablePhone: jest.fn().mockImplementation(() => {
      return;
    }),
    deleteUserAccount: jest.fn().mockImplementation(() => {
      return;
    }),
    changePassword: jest.fn().mockImplementation(() => {
      return;
    }),
    changeEmail: jest.fn().mockImplementation(() => {
      return;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
      providers: [{ provide: SecurityService, useValue: mockSecurityService }]
    })
      .overrideProvider(SecurityService)
      .useValue(mockSecurityService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SecurityController>(SecurityController);
    securityService = module.get<SecurityService>(SecurityService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registrationGenerateTwoFaQrCode', () => {
    it('Should call registrationGenerateTwoFaQrCode method with correct parameters', async () => {
      const confirmationHash = 'test-confirmation-hash';
      const trx: any = {};

      await controller.registrationGenerateTwoFaQrCode(confirmationHash, trx);

      expect(
        securityService.registrationGenerateTwoFaQrCode
      ).toHaveBeenCalledWith({
        confirmationHash,
        trx
      });
    }, 20000);
  });

  describe('loginGenerateTwoFaQrCode', () => {
    it('Should call loginGenerateTwoFaQrCode method with correct parameters', async () => {
      const payload: LoginGenerate2faQrDto = {
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx: any = {};

      await controller.loginGenerateTwoFaQrCode(payload, trx);

      expect(securityService.loginGenerateTwoFaQrCode).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('generateTwoFaQrCode', () => {
    it('Should call generateTwoFaQrCode method with correct parameters', async () => {
      const userId = uuid.v4();
      const trx: any = {};

      await controller.generateTwoFaQrCode(userId, trx);

      expect(securityService.generateTwoFaQrCode).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('registrationVerifyTwoFaQrCode', () => {
    it('Should call registrationVerifyTwoFaQrCode method with correct parameters', async () => {
      const payload: VerifyTwoFaDto = {
        code: '123123',
        twoFaToken: 'asd',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const confirmationHash = 'test-confirmation-hash';
      const trx: any = {};

      await controller.registrationVerifyTwoFaQrCode(
        payload,
        confirmationHash,
        trx
      );

      expect(
        securityService.registrationVerifyTwoFaQrCode
      ).toHaveBeenCalledWith({
        payload,
        confirmationHash,
        trx
      });
    }, 20000);
  });

  describe('loginVerifyTwoFaQrCode', () => {
    it('Should call loginVerifyTwoFaQrCode method with correct parameters', async () => {
      const payload: VerifyTwoFaDto = {
        code: '123123',
        twoFaToken: 'asd',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx: any = {};

      await controller.loginVerifyTwoFaQrCode(payload, trx);

      expect(securityService.loginVerifyTwoFaQrCode).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('verifyTwoFaQrCode', () => {
    it('Should call verifyTwoFaQrCode method with correct parameters', async () => {
      const payload: VerifyTwoFaDto = {
        code: '123123',
        twoFaToken: 'asd',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const userId = uuid.v4();
      const trx: any = {};

      await controller.verifyTwoFaQrCode(payload, userId, trx);

      expect(securityService.verifyTwoFaQrCode).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    });
  });

  describe('disableTwoFa', () => {
    it('Should call disableTwoFa method with correct parameters', async () => {
      const payload: DisableTwoFaDto = { code: '123123' };
      const userId = uuid.v4();
      const trx: any = {};

      await controller.disableTwoFa(payload, userId, trx);

      expect(securityService.disableTwoFa).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('registrationSendSmsCode', () => {
    it('Should call registrationSendSmsCode method with correct parameters', async () => {
      const payload: RegistrationSendSmsCodeDto = {
        phone: '123123123',
        language: Language.PL
      };
      const confirmationHash = 'test-confirmation-hash';
      const trx: any = {};

      await controller.registrationSendSmsCode(payload, confirmationHash, trx);

      expect(securityService.registrationSendSmsCode).toHaveBeenCalledWith({
        payload,
        confirmationHash,
        trx
      });
    }, 20000);
  });

  describe('loginSendSmsCode', () => {
    it('Should call loginSendSmsCode method with correct parameters', async () => {
      const payload: LoginSendSmsDto = {
        email: 'test@test.com',
        password: '12qw!@QW',
        language: Language.PL
      };
      const trx: any = {};

      await controller.loginSendSmsCode(payload, trx);

      expect(securityService.loginSendSmsCode).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('sendSmsCode', () => {
    it('Should call sendSmsCode method with correct parameters', async () => {
      const payload: RegistrationSendSmsCodeDto = {
        phone: '123123123',
        language: Language.PL
      };
      const userId = uuid.v4();
      const trx: any = {};

      await controller.sendSmsCode(payload, userId, trx);

      expect(securityService.sendSmsCode).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('hashSendSmsCode', () => {
    it('Should call hashSendSmsCode method with correct parameters', async () => {
      const trx: any = {};
      const confirmationHash = 'test-confirmation-hash';
      const language = Language.PL;

      await controller.hashSendSmsCode(trx, confirmationHash, language);

      expect(securityService.hashSendSmsCode).toHaveBeenCalledWith({
        trx,
        confirmationHash,
        language
      });
    }, 20000);
  });

  describe('getSmsCode', () => {
    it('Should call getSmsCode method with correct parameters', async () => {
      const language = Language.PL;
      const userId = uuid.v4();
      const trx: any = {};

      await controller.getSmsCode(language, userId, trx);

      expect(securityService.getSmsCode).toHaveBeenCalledWith({
        language,
        userId,
        trx
      });
    }, 20000);
  });

  describe('clearSmsCode', () => {
    it('Should call clearSmsCode method with correct parameters', async () => {
      const userId = uuid.v4();
      const trx: any = {};

      await controller.clearSmsCode(userId, trx);

      expect(securityService.clearSmsCode).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('registrationVerifyMobilePhone', () => {
    it('Should call registrationVerifyMobilePhone method with correct parameters', async () => {
      const payload: VerifyMobilePhoneDto = {
        phone: '123123123',
        code: '123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const confirmationHash = 'test-confirmation-hash';
      const trx: any = {};

      await controller.registrationVerifyMobilePhone(
        payload,
        confirmationHash,
        trx
      );

      expect(
        securityService.registrationVerifyMobilePhone
      ).toHaveBeenCalledWith({
        payload,
        confirmationHash,
        trx
      });
    }, 20000);
  });

  describe('loginVerifyMobilePhone', () => {
    it('Should call loginVerifyMobilePhone method with correct parameters', async () => {
      const payload: VerifyMobilePhoneDto = {
        phone: '123123123',
        code: '123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx: any = {};

      await controller.loginVerifyMobilePhone(payload, trx);

      expect(securityService.loginVerifyMobilePhone).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('verifyMobilePhone', () => {
    it('Should call verifyMobilePhone method with correct parameters', async () => {
      const payload: VerifyMobilePhoneDto = {
        phone: '123123123',
        code: '123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const userId = uuid.v4();
      const trx: any = {};

      await controller.verifyMobilePhone(payload, userId, trx);

      expect(securityService.verifyMobilePhone).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('disablePhone', () => {
    it('Should call disablePhone method with correct parameters', async () => {
      const payload: DisableTwoFaDto = { code: '123123' };
      const userId = uuid.v4();
      const trx: any = {};

      await controller.disablePhone(payload, userId, trx);

      expect(securityService.disablePhone).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('deleteUserAccount', () => {
    it('Should call deleteUserAccount method with correct parameters', async () => {
      const userId = uuid.v4();
      const payload: DeleteAccountDto = {
        password: '12qw!@QW',
        mfaCode: '123123',
        phoneCode: '123123',
        fullName: 'Jon Doe'
      };
      const trx: any = {};

      await controller.deleteUserAccount(userId, payload, trx);

      expect(securityService.deleteUserAccount).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('changePassword', () => {
    it('Should call changePassword method with correct parameters', async () => {
      const userId = uuid.v4();
      const payload: ChangePasswordDto = {
        currentPassword: '12qw!@QW',
        newPassword: '12qw!@QWv2',
        mfaCode: '123123',
        phoneCode: '123123'
      };
      const trx: any = {};

      await controller.changePassword(userId, payload, trx);

      expect(securityService.changePassword).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('changeEmail', () => {
    it('Should call changeEmail method with correct parameters', async () => {
      const userId = uuid.v4();
      const payload: ChangeEmailDto = {
        newEmail: 'test2@test.com',
        language: Language.PL
      };
      const trx: any = {};

      await controller.changeEmail(userId, payload, trx);

      expect(securityService.changeEmail).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });
});
