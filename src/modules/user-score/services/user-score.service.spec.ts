import { Test, TestingModule } from '@nestjs/testing';
import { UserScoreService } from './user-score.service';
import { DatabaseModule } from '../../../database/database.module';
import { UserModule } from '../../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entity/user.entity';
import { UserScore } from '../entity/user-score.entity';
import { UserScoreRepository } from '../repository/user-score.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { JWTProvider } from '../../user/providers/jwt.provider';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { TestHelper } from '../../../../test/helpers/dbInstanceHelper';

describe('UserScoreService', () => {
  let userScoreService: UserScoreService;

  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
  });

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        UserModule,
        TypeOrmModule.forFeature([User, UserScore]),
      ],
      providers: [
        UserScoreService,
        UserScoreRepository,
        UserRepository,
        JWTProvider,
      ],
    }).compile();

    userScoreService = module.get<UserScoreService>(UserScoreService);
  });

  it('should bring an array containing the top score users', async () => {
    const topScores = await userScoreService.bringTopScores();

    expect(topScores).toBeInstanceOf(Array);
  });

  it('should not bring an individual score if the user does not exist', async () => {
    expect(async () => {
      await userScoreService.bringIndividualScore(0);
    }).rejects.toThrow(UserNotFoundException);
  });

  it('should not update the score if the user does not exist', async () => {
    expect(async () => {
      await userScoreService.updateScore(0, 10);
    }).rejects.toThrow(UserNotFoundException);
  });

  it('should not update the score if the value is negative', async () => {
    expect(async () => {
      await userScoreService.updateScore(1, -10);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not update the score if the value is decimal', async () => {
    expect(async () => {
      await userScoreService.updateScore(1, 10.5);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not update the score if the value has more than 5 digits', async () => {
    expect(async () => {
      await userScoreService.updateScore(1, 100000);
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should update the user score given valid data', async () => {
    const userScore = await userScoreService.bringIndividualScore(1);

    await userScoreService.updateScore(1, 10);

    const updatedUserScore = await userScoreService.bringIndividualScore(1);

    expect(updatedUserScore.total_score).toBe(userScore.total_score + 10);
  });
});
