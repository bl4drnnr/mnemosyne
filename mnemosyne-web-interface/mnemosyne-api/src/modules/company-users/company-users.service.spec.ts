import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersService } from './company-users.service';

describe('CompanyUsersService', () => {
  let service: CompanyUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CompanyUsersService, useValue: {} }]
    }).compile();

    service = module.get<CompanyUsersService>(CompanyUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
