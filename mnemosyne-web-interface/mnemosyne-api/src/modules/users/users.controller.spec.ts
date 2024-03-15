import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthGuard } from '@guards/auth.guard';
import { UsersService } from '@modules/users.service';
import { Sequelize } from 'sequelize-typescript';
import { ForgotPasswordInterface } from '@interfaces/forgot-password.interface';
import { UploadPhotoInterface } from '@interfaces/upload-photo.interface';
import { GetUserInfoInterface } from '@interfaces/get-user-info.interface';
import { GetUserSecuritySettingsInterface } from '@interfaces/get-user-security-settings.interface';
import { UpdateUserInfoInterface } from '@interfaces/update-user-info.interface';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { Language } from '@interfaces/language.enum';
import { UploadPhotoDto } from '@dto/upload-photo.dto';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';

dotenv.config({ path: '.env.test' });

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let sequelize: Sequelize;

  const mockUsersService = {
    forgotPassword: jest
      .fn()
      .mockImplementation(({ payload, trx }: ForgotPasswordInterface) => {
        return;
      }),
    uploadUserPhoto: jest
      .fn()
      .mockImplementation(({ payload, userId }: UploadPhotoInterface) => {
        return;
      }),
    getUserInfo: jest
      .fn()
      .mockImplementation(({ userId, trx }: GetUserInfoInterface) => {
        return;
      }),
    getUserSecuritySettings: jest
      .fn()
      .mockImplementation(
        ({ userId, trx }: GetUserSecuritySettingsInterface) => {
          return;
        }
      ),
    updateUserInfo: jest
      .fn()
      .mockImplementation(
        ({ userId, payload, trx }: UpdateUserInfoInterface) => {
          return;
        }
      )
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

  describe('Forgot Password', () => {
    it('Should call forgotPassword method with correct parameters', async () => {
      const payload: ForgotPasswordDto = {
        email: 'test@test.com',
        language: Language.PL
      };
      const trx = await sequelize.transaction();

      await controller.forgotPassword(payload, trx);

      expect(usersService.forgotPassword).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Upload User Photo', () => {
    it('Should call uploadUserPhoto method with correct parameters', async () => {
      const payload: UploadPhotoDto = {
        userPhoto: 'base64-string'
      };
      const userId = 'test-user-id';

      await controller.uploadUserPhoto(payload, userId);

      expect(usersService.uploadUserPhoto).toHaveBeenCalledWith({
        payload,
        userId
      });
    }, 20000);
  });

  describe('Get User Info', () => {
    it('Should call getUserInfo method with correct parameters', async () => {
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.getUserInfo(userId, trx);

      expect(usersService.getUserInfo).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('User Security', () => {
    it('Should call getUserSecuritySettings method with correct parameters', async () => {
      const userId = 'test-user-id';
      const trx = await sequelize.transaction();

      await controller.getUserSecuritySettings(userId, trx);

      expect(usersService.getUserSecuritySettings).toHaveBeenCalledWith({
        userId,
        trx
      });
    }, 20000);
  });

  describe('Update User Info', () => {
    it('Should call updateUserInfo method with correct parameters', async () => {
      const userId = 'test-user-id';
      const payload: UpdateUserInfoDto = {
        firstName: 'Jon',
        lastName: 'Doe',
        namePronunciation: 'Jon Doe',
        homeAddress: '5th Avenu',
        homePhone: '123123123'
      };
      const trx = await sequelize.transaction();

      await controller.updateUserInfo(userId, payload, trx);

      expect(usersService.updateUserInfo).toHaveBeenCalledWith({
        userId,
        payload,
        trx
      });
    }, 20000);
  });
});
