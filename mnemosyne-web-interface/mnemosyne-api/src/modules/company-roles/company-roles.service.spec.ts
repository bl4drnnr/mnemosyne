import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRolesService } from './company-roles.service';

describe('CompanyRolesService', () => {
  let service: CompanyRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyRolesService]
    }).compile();

    service = module.get<CompanyRolesService>(CompanyRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
