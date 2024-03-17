import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthGuard } from '@guards/auth.guard';
import { UsersService } from '@modules/users.service';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { Language } from '@interfaces/language.enum';
import { UploadPhotoDto } from '@dto/upload-photo.dto';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';

dotenv.config({ path: '.env.test' });

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    forgotPassword: jest.fn().mockImplementation(() => {
      return;
    }),
    uploadUserPhoto: jest.fn().mockImplementation(() => {
      return;
    }),
    getUserInfo: jest.fn().mockImplementation(() => {
      return;
    }),
    getUserSecuritySettings: jest.fn().mockImplementation(() => {
      return;
    }),
    updateUserInfo: jest.fn().mockImplementation(() => {
      return;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }]
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('forgotPassword', () => {
    it('Should call forgotPassword method with correct parameters', async () => {
      const payload: ForgotPasswordDto = {
        email: 'test@test.com',
        language: Language.PL
      };
      const trx: any = {};

      await controller.forgotPassword(payload, trx);

      expect(usersService.forgotPassword).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('uploadUserPhoto', () => {
    it('Should call uploadUserPhoto method with correct parameters', async () => {
      const payload: UploadPhotoDto = {
        userPhoto: 'base64-string'
      };
      const userId = uuid.v4();

      await controller.uploadUserPhoto(payload, userId);

      expect(usersService.uploadUserPhoto).toHaveBeenCalledWith({
        payload,
        userId
      });
    }, 20000);
  });

  describe('getUserInfo', () => {
    it('Should call getUserInfo method with correct parameters', async () => {
      const userId = uuid.v4();
      const trx: any = {};

      await controller.getUserInfo(userId, trx);

      expect(usersService.getUserInfo).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('getUserSecuritySettings', () => {
    it('Should call getUserSecuritySettings method with correct parameters', async () => {
      const userId = uuid.v4();
      const trx: any = {};

      await controller.getUserSecuritySettings(userId, trx);

      expect(usersService.getUserSecuritySettings).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('updateUserInfo', () => {
    it('Should call updateUserInfo method with correct parameters', async () => {
      const userId = uuid.v4();
      const payload: UpdateUserInfoDto = {
        firstName: 'Jon',
        lastName: 'Doe',
        namePronunciation: 'Jon Doe',
        homeAddress: '5th Avenu',
        homePhone: '123123123'
      };
      const trx: any = {};

      await controller.updateUserInfo(userId, payload, trx);

      expect(usersService.updateUserInfo).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });
});
