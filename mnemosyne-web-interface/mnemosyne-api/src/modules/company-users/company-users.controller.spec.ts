import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from '@modules/company-users.service';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';

describe('CompanyUsersController', () => {
  let controller: CompanyUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyUsersController],
      providers: [{ provide: CompanyUsersService, useValue: {} }]
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CompanyUsersController>(CompanyUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
