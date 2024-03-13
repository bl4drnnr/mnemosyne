import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { AuthGuard } from '@guards/auth.guard';
import { RoleGuard } from '@guards/role.guard';
import { RolesService } from '@modules/roles.service';
import { Sequelize } from 'sequelize-typescript';
import { GetCompanyRolesInterface } from '@interfaces/get-company-roles.interface';
import { CreateCompanyRoleInterface } from '@interfaces/create-company-role.interface';
import { UpdateCompanyRoleInterface } from '@interfaces/update-company-role.interface';
import { AssignRoleInterface } from '@interfaces/assign-role.interface';
import { RevokeRoleInterface } from '@interfaces/revoke-role.interface';
import { CreateCompanyRoleDto } from '@dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from '@dto/update-company-role.dto';
import { AssignRoleDto } from '@dto/assign-role.dto';
import { RevokeRoleDto } from '@dto/revoke-role.dto';

dotenv.config({ path: '.env.test' });

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;
  let sequelize: Sequelize;

  const mockRolesService = {
    getCompanyRoles: jest
      .fn()
      .mockImplementation(
        ({ companyId, trx: transaction }: GetCompanyRolesInterface) => {
          return;
        }
      ),
    createCompanyRole: jest
      .fn()
      .mockImplementation(
        ({
          companyId,
          payload,
          trx: transaction
        }: CreateCompanyRoleInterface) => {
          return;
        }
      ),
    updateCompanyRole: jest
      .fn()
      .mockImplementation(
        ({
          companyId,
          payload,
          trx: transaction
        }: UpdateCompanyRoleInterface) => {
          return;
        }
      ),
    assignRoleToUser: jest
      .fn()
      .mockImplementation(
        ({ companyId, payload, trx }: AssignRoleInterface) => {
          return;
        }
      ),
    revokeUserRole: jest
      .fn()
      .mockImplementation(
        ({ companyId, payload, trx }: RevokeRoleInterface) => {
          return;
        }
      )
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

  describe('Get Company Roles', () => {
    it('Should call getCompanyRoles method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const trx = await sequelize.transaction();

      await controller.getCompanyRoles(companyId, trx);

      expect(rolesService.getCompanyRoles).toHaveBeenCalledWith({
        companyId,
        trx
      });
    });
  });

  describe('Create Role', () => {
    it('Should call createCompanyRole method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: CreateCompanyRoleDto = {
        name: 'New role',
        description: 'New role description',
        roleScopes: ['USER_MANAGEMENT'],
        roleAssignees: ['test2@test.com']
      };
      const trx = await sequelize.transaction();

      await controller.createCompanyRole(companyId, payload, trx);

      expect(rolesService.createCompanyRole).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    });
  });

  describe('Update Role', () => {
    it('Should call updateCompanyRole method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: UpdateCompanyRoleDto = {
        name: 'New role',
        description: 'New role description',
        roleScopes: ['USER_MANAGEMENT']
      };
      const trx = await sequelize.transaction();

      await controller.updateCompanyRole(companyId, payload, trx);

      expect(rolesService.updateCompanyRole).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    });
  });

  describe('Assign Role', () => {
    it('Should call assignRoleToUser method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: AssignRoleDto = {};
      const trx = await sequelize.transaction();

      await controller.assignRoleToUser(companyId, payload, trx);

      expect(rolesService.assignRoleToUser).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    });
  });

  describe('Revoke Role', () => {
    it('Should call revokeUserRole method with correct parameters', async () => {
      const companyId = 'test-company-id';
      const payload: RevokeRoleDto = {};
      const trx = await sequelize.transaction();

      await controller.revokeUserRole(companyId, payload, trx);

      expect(rolesService.revokeUserRole).toHaveBeenCalledWith({
        companyId,
        payload,
        trx
      });
    });
  });
});
