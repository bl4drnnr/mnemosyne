import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationHashController } from './confirmation-hash.controller';

describe('ConfirmationHashController', () => {
  let controller: ConfirmationHashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmationHashController]
    }).compile();

    controller = module.get<ConfirmationHashController>(
      ConfirmationHashController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
