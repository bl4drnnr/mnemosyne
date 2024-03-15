import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryService } from './recovery.service';
import { UsersService } from '@modules/users.service';
import { CryptographicService } from '@shared/cryptographic.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { User } from '@models/user.model';
import { getModelToken } from '@nestjs/sequelize';

describe('RecoveryService', () => {
  let service: RecoveryService;
  let userRepository: typeof User;

  const userRepositoryToken: string | Function = getModelToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecoveryService,
        {
          provide: userRepositoryToken,
          useValue: User
        }
      ]
    }).compile();

    service = module.get<RecoveryService>(RecoveryService);
    userRepository = module.get<typeof User>(userRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
