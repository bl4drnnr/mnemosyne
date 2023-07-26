import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryController } from './recovery.controller';

describe('RecoveryController', () => {
  let controller: RecoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoveryController]
    }).compile();

    controller = module.get<RecoveryController>(RecoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
