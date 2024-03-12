import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryController } from './recovery.controller';
import { RecoveryService } from '@modules/recovery.service';

describe('RecoveryController', () => {
  let controller: RecoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoveryController],
      providers: [RecoveryService]
    }).compile();

    controller = module.get<RecoveryController>(RecoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
