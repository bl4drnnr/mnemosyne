import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationHashService } from './confirmation-hash.service';

describe('ConfirmationHashService', () => {
  let service: ConfirmationHashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ConfirmationHashService, useValue: {} }]
    }).compile();

    service = module.get<ConfirmationHashService>(ConfirmationHashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
