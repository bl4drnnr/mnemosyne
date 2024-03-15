import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { SecurityController } from './security.controller';
import { AuthGuard } from '@guards/auth.guard';
import { SecurityService } from '@modules/security.service';
import { Sequelize } from 'sequelize-typescript';
import { RegistrationGenerate2faInterface } from '@interfaces/registration-generate-2fa.interface';
import { LoginGenerate2faInterface } from '@interfaces/login-generate-2fa.interface';
import { Generate2faInterface } from '@interfaces/generate-2fa.interface';
import { RegistrationVerify2faInterface } from '@interfaces/registration-verify-2fa.interface';
import { LoginVerify2faInterface } from '@interfaces/login-verify-2fa.interface';
import { Verify2faInterface } from '@interfaces/verify-2fa.interface';
import { Disable2faInterface } from '@interfaces/disable-2fa.interface';
import { RegistrationSendSmsInterface } from '@interfaces/registration-send-sms.interface';
import { LoginSendSmsInterface } from '@interfaces/login-send-sms.interface';
import { SendSmsInterface } from '@interfaces/send-sms.interface';
import { HashSendSmsInterface } from '@interfaces/hash-send-sms.interface';
import { GetSmsInterface } from '@interfaces/get-sms.interface';
import { ClearSmsInterface } from '@interfaces/clear-sms.interface';
import { RegistrationVerifyPhoneInterface } from '@interfaces/registration-verify-phone.interface';
import { LoginVerifyPhoneInterface } from '@interfaces/login-verify-phone.interface';
import { VerifyPhoneInterface } from '@interfaces/verify-phone.interface';
import { DisablePhoneInterface } from '@interfaces/disable-phone.interface';
import { DeleteAccountInterface } from '@interfaces/delete-account.interface';
import { ChangePasswordInterface } from '@interfaces/change-password.interface';
import { ChangeEmailInterface } from '@interfaces/change-email.interface';
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
  let sequelize: Sequelize;

  const mockSecurityService = {
    registrationGenerateTwoFaQrCode: jest
      .fn()
      .mockImplementation(
        ({ confirmationHash, trx }: RegistrationGenerate2faInterface) => {
          return;
        }
      ),
    loginGenerateTwoFaQrCode: jest
      .fn()
      .mockImplementation(({ payload, trx }: LoginGenerate2faInterface) => {
        return;
      }),
    generateTwoFaQrCode: jest
      .fn()
      .mockImplementation(({ userId, trx }: Generate2faInterface) => {
        return;
      }),
    registrationVerifyTwoFaQrCode: jest
      .fn()
      .mockImplementation(
        ({
          payload,
          confirmationHash,
          trx
        }: RegistrationVerify2faInterface) => {
          return;
        }
      ),
    loginVerifyTwoFaQrCode: jest
      .fn()
      .mockImplementation(({ payload, trx }: LoginVerify2faInterface) => {
        return;
      }),
    verifyTwoFaQrCode: jest
      .fn()
      .mockImplementation(({ payload, userId, trx }: Verify2faInterface) => {
        return;
      }),
    disableTwoFa: jest
      .fn()
      .mockImplementation(({ payload, userId, trx }: Disable2faInterface) => {
        return;
      }),
    registrationSendSmsCode: jest
      .fn()
      .mockImplementation(
        ({ payload, confirmationHash, trx }: RegistrationSendSmsInterface) => {
          return;
        }
      ),
    loginSendSmsCode: jest
      .fn()
      .mockImplementation(({ payload, trx }: LoginSendSmsInterface) => {
        return;
      }),
    sendSmsCode: jest
      .fn()
      .mockImplementation(({ payload, userId, trx }: SendSmsInterface) => {
        return;
      }),
    hashSendSmsCode: jest
      .fn()
      .mockImplementation(
        ({ confirmationHash, language, trx }: HashSendSmsInterface) => {
          return;
        }
      ),
    getSmsCode: jest
      .fn()
      .mockImplementation(({ userId, language, trx }: GetSmsInterface) => {
        return;
      }),
    clearSmsCode: jest
      .fn()
      .mockImplementation(({ userId, trx }: ClearSmsInterface) => {
        return;
      }),
    registrationVerifyMobilePhone: jest
      .fn()
      .mockImplementation(
        ({
          payload,
          confirmationHash,
          trx
        }: RegistrationVerifyPhoneInterface) => {
          return;
        }
      ),
    loginVerifyMobilePhone: jest
      .fn()
      .mockImplementation(({ payload, trx }: LoginVerifyPhoneInterface) => {
        return;
      }),
    verifyMobilePhone: jest
      .fn()
      .mockImplementation(({ payload, userId, trx }: VerifyPhoneInterface) => {
        return;
      }),
    disablePhone: jest
      .fn()
      .mockImplementation(({ payload, userId, trx }: DisablePhoneInterface) => {
        return;
      }),
    deleteUserAccount: jest
      .fn()
      .mockImplementation(
        ({ userId, payload, trx }: DeleteAccountInterface) => {
          return;
        }
      ),
    changePassword: jest
      .fn()
      .mockImplementation(
        ({ userId, payload, trx }: ChangePasswordInterface) => {
          return;
        }
      ),
    changeEmail: jest
      .fn()
      .mockImplementation(({ userId, payload, trx }: ChangeEmailInterface) => {
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

  describe('Registration Generate 2FA QR', () => {
    it('Should call registrationGenerateTwoFaQrCode method with correct parameters', async () => {
      const confirmationHash = 'test-confirmation-hash';
      const trx = await sequelize.transaction();

      await controller.registrationGenerateTwoFaQrCode(confirmationHash, trx);

      expect(
        securityService.registrationGenerateTwoFaQrCode
      ).toHaveBeenCalledWith({
        confirmationHash,
        trx
      });
    }, 20000);
  });

  describe('Login Generate 2FA QR', () => {
    it('Should call loginGenerateTwoFaQrCode method with correct parameters', async () => {
      const payload: LoginGenerate2faQrDto = {
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx = await sequelize.transaction();

      await controller.loginGenerateTwoFaQrCode(payload, trx);

      expect(securityService.loginGenerateTwoFaQrCode).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Generate 2FA QR', () => {
    it('Should call generateTwoFaQrCode method with correct parameters', async () => {
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.generateTwoFaQrCode(userId, trx);

      expect(securityService.generateTwoFaQrCode).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('Registration Verify 2FA', () => {
    it('Should call registrationVerifyTwoFaQrCode method with correct parameters', async () => {
      const payload: VerifyTwoFaDto = {
        code: '123123',
        twoFaToken: 'asd',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const confirmationHash = 'test-confirmation-hash';
      const trx = await sequelize.transaction();

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

  describe('Login Verify 2FA', () => {
    it('Should call loginVerifyTwoFaQrCode method with correct parameters', async () => {
      const payload: VerifyTwoFaDto = {
        code: '123123',
        twoFaToken: 'asd',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx = await sequelize.transaction();

      await controller.loginVerifyTwoFaQrCode(payload, trx);

      expect(securityService.loginVerifyTwoFaQrCode).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Verify 2FA', () => {
    it('Should call verifyTwoFaQrCode method with correct parameters', async () => {
      const payload: VerifyTwoFaDto = {
        code: '123123',
        twoFaToken: 'asd',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.verifyTwoFaQrCode(payload, userId, trx);

      expect(securityService.verifyTwoFaQrCode).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    });
  });

  describe('Disable 2FA', () => {
    it('Should call disableTwoFa method with correct parameters', async () => {
      const payload: DisableTwoFaDto = { code: '123123' };
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.disableTwoFa(payload, userId, trx);

      expect(securityService.disableTwoFa).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('Registration Send SMS Code', () => {
    it('Should call registrationSendSmsCode method with correct parameters', async () => {
      const payload: RegistrationSendSmsCodeDto = {
        phone: '123123123',
        language: Language.PL
      };
      const confirmationHash = 'test-confirmation-hash';
      const trx = await sequelize.transaction();

      await controller.registrationSendSmsCode(payload, confirmationHash, trx);

      expect(securityService.registrationSendSmsCode).toHaveBeenCalledWith({
        payload,
        confirmationHash,
        trx
      });
    }, 20000);
  });

  describe('Login Send SMS Code', () => {
    it('Should call loginSendSmsCode method with correct parameters', async () => {
      const payload: LoginSendSmsDto = {
        email: 'test@test.com',
        password: '12qw!@QW',
        language: Language.PL
      };
      const trx = await sequelize.transaction();

      await controller.loginSendSmsCode(payload, trx);

      expect(securityService.loginSendSmsCode).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Send SMS Code', () => {
    it('Should call sendSmsCode method with correct parameters', async () => {
      const payload: RegistrationSendSmsCodeDto = {
        phone: '123123123',
        language: Language.PL
      };
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.sendSmsCode(payload, userId, trx);

      expect(securityService.sendSmsCode).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('Hash Send SMS Code', () => {
    it('Should call hashSendSmsCode method with correct parameters', async () => {
      const trx = await sequelize.transaction();
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

  describe('Get SMS Code', () => {
    it('Should call getSmsCode method with correct parameters', async () => {
      const language = Language.PL;
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.getSmsCode(language, userId, trx);

      expect(securityService.getSmsCode).toHaveBeenCalledWith({
        language,
        userId,
        trx
      });
    }, 20000);
  });

  describe('Clear SMS Code', () => {
    it('Should call clearSmsCode method with correct parameters', async () => {
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.clearSmsCode(userId, trx);

      expect(securityService.clearSmsCode).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('Registration Verify Mobile Phone', () => {
    it('Should call registrationVerifyMobilePhone method with correct parameters', async () => {
      const payload: VerifyMobilePhoneDto = {
        phone: '123123123',
        code: '123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const confirmationHash = 'test-confirmation-hash';
      const trx = await sequelize.transaction();

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

  describe('Login Verify Mobile Phone', () => {
    it('Should call loginVerifyMobilePhone method with correct parameters', async () => {
      const payload: VerifyMobilePhoneDto = {
        phone: '123123123',
        code: '123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const trx = await sequelize.transaction();

      await controller.loginVerifyMobilePhone(payload, trx);

      expect(securityService.loginVerifyMobilePhone).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Verify Mobile Phone', () => {
    it('Should call verifyMobilePhone method with correct parameters', async () => {
      const payload: VerifyMobilePhoneDto = {
        phone: '123123123',
        code: '123',
        email: 'test@test.com',
        password: '12qw!@QW'
      };
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.verifyMobilePhone(payload, userId, trx);

      expect(securityService.verifyMobilePhone).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('Disable Phone', () => {
    it('Should call disablePhone method with correct parameters', async () => {
      const payload: DisableTwoFaDto = { code: '123123' };
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.disablePhone(payload, userId, trx);

      expect(securityService.disablePhone).toHaveBeenCalledWith({
        payload,
        userId,
        trx
      });
    }, 20000);
  });

  describe('Delete Account', () => {
    it('Should call deleteUserAccount method with correct parameters', async () => {
      const userId = 'test-user-id';
      const payload: DeleteAccountDto = {
        password: '12qw!@QW',
        mfaCode: '123123',
        phoneCode: '123123',
        fullName: 'Jon Doe'
      };
      const trx = await sequelize.transaction();

      await controller.deleteUserAccount(userId, payload, trx);

      expect(securityService.deleteUserAccount).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('Change Password', () => {
    it('Should call changePassword method with correct parameters', async () => {
      const userId = 'test-user-id';
      const payload: ChangePasswordDto = {
        currentPassword: '12qw!@QW',
        newPassword: '12qw!@QWv2',
        mfaCode: '123123',
        phoneCode: '123123'
      };
      const trx = await sequelize.transaction();

      await controller.changePassword(userId, payload, trx);

      expect(securityService.changePassword).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('Change Email', () => {
    it('Should call changeEmail method with correct parameters', async () => {
      const userId = 'test-user-id';
      const payload: ChangeEmailDto = {
        newEmail: 'test2@test.com',
        language: Language.PL
      };
      const trx = await sequelize.transaction();

      await controller.changeEmail(userId, payload, trx);

      expect(securityService.changeEmail).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });
});
