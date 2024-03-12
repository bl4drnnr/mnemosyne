import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationHashController } from './confirmation-hash.controller';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';

describe('ConfirmationHashController', () => {
  let controller: ConfirmationHashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmationHashController],
      providers: [{ provide: ConfirmationHashService, useValue: {} }]
    }).compile();

    controller = module.get<ConfirmationHashController>(
      ConfirmationHashController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
