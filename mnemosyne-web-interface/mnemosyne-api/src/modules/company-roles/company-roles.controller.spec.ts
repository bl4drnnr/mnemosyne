import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRolesController } from './company-roles.controller';

describe('CompanyRolesController', () => {
  let controller: CompanyRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyRolesController]
    }).compile();

    controller = module.get<CompanyRolesController>(CompanyRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
