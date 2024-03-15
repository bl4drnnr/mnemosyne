import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@modules/auth.service';
import { AuthGuard } from '@guards/auth.guard';
import { Sequelize } from 'sequelize-typescript';
import { LoginInterface } from '@interfaces/login.interface';
import { RegistrationInterface } from '@interfaces/registration.interface';
import { LogoutInterface } from '@interfaces/logout.interface';
import { RefreshTokenInterface } from '@interfaces/refresh-token.interface';
import { LogInUserDto } from '@dto/log-in-user.dto';
import { CreateUserDto } from '@dto/create-user.dto';
import { Language } from '@interfaces/language.enum';

dotenv.config({ path: '.env.test' });

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let sequelize: Sequelize;

  const mockAuthService = {
    login: jest.fn().mockImplementation(({ payload, trx }: LoginInterface) => {
      return;
    }),
    registration: jest
      .fn()
      .mockImplementation(({ payload, trx }: RegistrationInterface) => {
        return;
      }),
    logout: jest.fn().mockImplementation(({ userId, trx }: LogoutInterface) => {
      return;
    }),
    refreshToken: jest
      .fn()
      .mockImplementation(({ refreshToken, trx }: RefreshTokenInterface) => {
        return;
      })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
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

  describe('Login', () => {
    it('Should call login with correct parameters', async () => {
      const payload: LogInUserDto = {
        email: 'test@test.com',
        password: '12qw!@QW',
        phoneCode: '123123',
        mfaCode: '123123'
      };
      const trx = await sequelize.transaction();

      await controller.login(payload, trx);

      expect(authService.login).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Registration', () => {
    it('Should call registration with correct parameters', async () => {
      const payload: CreateUserDto = {
        email: 'test@test.com',
        password: '12qw!@QW',
        firstName: 'Jon',
        lastName: 'Doe',
        tac: true,
        language: Language.PL,
        namePronunciation: 'Jon Doe',
        homeAddress: '5th Avenu',
        homePhone: '123123123'
      };
      const trx = await sequelize.transaction();

      await controller.registration(payload, trx);

      expect(authService.registration).toHaveBeenCalledWith({
        payload,
        trx
      });
    }, 20000);
  });

  describe('Refresh', () => {
    it('Should call refresh with correct parameters', async () => {
      const refreshToken = 'refresh-token';
      const trx = await sequelize.transaction();

      await controller.refreshToken(refreshToken, trx);

      expect(authService.refreshToken).toHaveBeenCalledWith({
        refreshToken,
        trx
      });
    }, 20000);
  });
});
