import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { RolesService } from '@modules/roles.service';
import { CreateCompanyRoleDto } from '@dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';

dotenv.config({ path: '.env.test' });

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;

  const mockRolesService = {
    getCompanyRoles: jest.fn().mockImplementation(() => {
      return;
    }),
    createCompanyRole: jest.fn().mockImplementation(() => {
      return;
    }),
    updateCompanyRole: jest.fn().mockImplementation(() => {
      return;
    }),
    assignRoleToUser: jest.fn().mockImplementation(() => {
      return;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockRolesService }]
    })
      .overrideProvider(RolesService)
      .useValue(mockRolesService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCompanyRoles', () => {
    it('Should call getCompanyRoles method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const trx: any = {};

      await controller.getCompanyRoles(companyId, trx);

      expect(rolesService.getCompanyRoles).toHaveBeenCalledWith({
        companyId,
        trx
      });
    }, 20000);
  });

  describe('createCompanyRole', () => {
    it('Should call createCompanyRole method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: CreateCompanyRoleDto = {
        name: 'New role',
        description: 'New role description',
        roleScopes: ['USER_MANAGEMENT'],
        roleAssignees: ['test2@test.com']
      };
      const trx: any = {};

      await controller.createCompanyRole(companyId, payload, trx);

      expect(rolesService.createCompanyRole).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    }, 20000);
  });

  describe('updateCompanyRole', () => {
    it('Should call updateCompanyRole method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: UpdateCompanyRoleDto = {
        name: 'New role',
        description: 'New role description',
        roleScopes: ['USER_MANAGEMENT']
      };
      const trx: any = {};

      await controller.updateCompanyRole(companyId, payload, trx);

      expect(rolesService.updateCompanyRole).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    }, 20000);
  });
});
