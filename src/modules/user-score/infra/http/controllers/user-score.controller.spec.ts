import { Test, TestingModule } from '@nestjs/testing';
import { UserScoreController } from './user-score.controller';

describe('UserScoreController', () => {
  let controller: UserScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserScoreController],
    }).compile();

    controller = module.get<UserScoreController>(UserScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
