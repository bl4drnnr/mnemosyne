import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { UtilsService } from '@shared/utils.service';
import { Role } from '@models/role.model';
import { GetCompanyRolesDto } from '@dto/get-company-roles.dto';
import { Company } from '@models/company.model';
import { RoleScope } from '@custom-types/role-scope.type';
import { getModelToken } from '@nestjs/sequelize';
import { UserRole } from '@models/user-role.model';
import { Op } from 'sequelize';
import { CompanyRoleCreatedDto } from '@dto/company-role-created.dto';
import { RoleAlreadyExistsException } from '@exceptions/role-already-exists.exception';
import { CompanyRoleUpdatedDto } from '@dto/company-role-updated.dto';
import { RoleDoesntExistException } from '@exceptions/role-doesnt-exist.exception';
import { CompanyUsersService } from '@modules/company-users.service';

dotenv.config({ path: '.env.test' });

describe('RolesService', () => {
  let service: RolesService;
  let companyUsersService: CompanyUsersService;

  const roleRepositoryToken = getModelToken(Role);
  const userRoleRepositoryToken = getModelToken(UserRole);

  const mockUserRoleRepository = {
    create: jest.fn(),
    destroy: jest.fn()
  };
  const mockRoleRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };
  const mockUtilsService = {
    removeDuplicates: jest.fn()
  };
  const mockCompanyUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: CompanyUsersService,
          useValue: mockCompanyUsersService
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService
        },
        {
          provide: roleRepositoryToken,
          useValue: mockRoleRepository
        },
        {
          provide: userRoleRepositoryToken,
          useValue: mockUserRoleRepository
        }
      ]
    }).compile();

    service = module.get<RolesService>(RolesService);
    companyUsersService = module.get<CompanyUsersService>(CompanyUsersService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCompanyRoles', () => {
    it('Should get company roles', async () => {
      const companyId = uuid.v4();
      const trx: any = {};
      const allAssignedRoles = [
        {
          id: 'role1-id',
          name: 'role1',
          description: 'description1',
          roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>
        },
        {
          id: 'role2-id',
          name: 'role2',
          description: 'description2',
          roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>
        }
      ];

      const expectedResult = [
        {
          id: 'role1-id',
          name: 'role1',
          description: 'description1',
          roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>
        },
        {
          id: 'role2-id',
          name: 'role2',
          description: 'description2',
          roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>
        }
      ];

      const getCompanyRolesInterface = {
        companyId,
        trx
      };

      mockRoleRepository.findAll.mockResolvedValueOnce(allAssignedRoles);
      mockUtilsService.removeDuplicates.mockReturnValueOnce(allAssignedRoles);

      const result = await service.getCompanyRoles(getCompanyRolesInterface);

      expect(mockRoleRepository.findAll).toHaveBeenCalledWith({
        include: {
          model: Company,
          where: { id: companyId }
        },
        transaction: trx
      });
      expect(mockUtilsService.removeDuplicates).toHaveBeenCalledWith(
        allAssignedRoles,
        'name'
      );
      expect(result).toEqual(new GetCompanyRolesDto(expectedResult));
    });
  });

  describe('createCompanyRole', () => {
    it('Should create a new company role', async () => {
      const companyId = uuid.v4();
      const payload = {
        name: 'roleName',
        description: 'roleDescription',
        roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>,
        roleAssignees: ['assignee1', 'assignee2']
      };
      const transaction: any = {};
      const alreadyExistingRoles = [];

      const createdRole = { id: uuid.v4() };

      const createCompanyRoleInterface = {
        companyId,
        payload,
        trx: transaction
      };

      mockRoleRepository.findAll.mockResolvedValueOnce(alreadyExistingRoles);
      mockRoleRepository.create.mockResolvedValueOnce(createdRole);

      const result = await service.createCompanyRole(
        createCompanyRoleInterface
      );

      expect(mockRoleRepository.findAll).toHaveBeenCalledWith({
        where: {
          name: {
            [Op.iLike]: `%${payload.name}%`
          }
        },
        include: {
          model: Company,
          where: { id: companyId }
        },
        transaction
      });
      expect(mockRoleRepository.create).toHaveBeenCalledWith(
        {
          name: payload.name,
          description: payload.description,
          roleScopes: payload.roleScopes
        },
        { transaction, returning: ['id'] }
      );
      expect(mockUserRoleRepository.create).toHaveBeenCalledTimes(
        payload.roleAssignees.length
      );
      expect(result).toEqual(new CompanyRoleCreatedDto());
    });

    it('Should throw RoleAlreadyExistsException if role already exists', async () => {
      const companyId = uuid.v4();
      const payload = {
        name: 'roleName',
        description: 'roleDescription',
        roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>,
        roleAssignees: ['assignee1', 'assignee2']
      };
      const transaction: any = {};
      const alreadyExistingRoles = [{ id: uuid.v4() }];

      const createCompanyRoleInterface = {
        companyId,
        payload,
        trx: transaction
      };

      mockRoleRepository.findAll.mockResolvedValueOnce(alreadyExistingRoles);

      await expect(
        service.createCompanyRole(createCompanyRoleInterface)
      ).rejects.toThrowError(RoleAlreadyExistsException);
    });
  });

  describe('updateCompanyRole', () => {
    it('Should update company roles', async () => {
      const companyId = uuid.v4();
      const payload = {
        name: 'updatedRoleName',
        description: 'updatedRoleDescription',
        roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>
      };
      const transaction: any = {};
      const companyRoles = [{ id: uuid.v4() }, { id: uuid.v4() }];

      const updateCompanyRoleInterface = {
        companyId,
        payload,
        trx: transaction
      };

      mockRoleRepository.findAll.mockResolvedValueOnce(companyRoles);

      const result = await service.updateCompanyRole(
        updateCompanyRoleInterface
      );

      expect(mockRoleRepository.findAll).toHaveBeenCalledWith({
        where: { name: payload.name },
        include: {
          model: Company,
          where: { id: companyId }
        },
        transaction
      });
      expect(mockRoleRepository.update).toHaveBeenCalledWith(
        {
          ...payload
        },
        {
          returning: false,
          where: {
            id: { [Op.in]: companyRoles.map(({ id }) => id) }
          },
          transaction
        }
      );
      expect(result).toEqual(new CompanyRoleUpdatedDto());
    });

    it('Should throw RoleDoesntExistException if no company roles are found', async () => {
      const companyId = uuid.v4();
      const payload = {
        name: 'nonExistingRoleName',
        description: 'nonExistingRoleDesc',
        roleScopes: ['USER_MANAGEMENT'] as Array<RoleScope>
      };
      const transaction: any = {};
      const companyRoles = null;

      const updateCompanyRoleInterface = {
        companyId,
        payload,
        trx: transaction
      };

      mockRoleRepository.findAll.mockResolvedValueOnce(companyRoles);

      await expect(
        service.updateCompanyRole(updateCompanyRoleInterface)
      ).rejects.toThrowError(RoleDoesntExistException);
    });
  });
});
