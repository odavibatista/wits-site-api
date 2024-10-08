import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivitiesAnsweredService } from './user-activities-answered.service';
import { DatabaseModule } from '../../../../database/database.module';
import { UserModule } from '../../../user/infra/modules/user.module';
import { User } from '../../../user/infra/db/entity/user.entity';
import { UserScore } from '../../../user-score/infra/db/entity/user-score.entity';
import { UserScoreService } from '../../../user-score/infra/services/user-score.service';
import { UserScoreRepository } from '../../../user-score/infra/db/repositories/user-score.repository';
import { UserRepository } from '../../../user/infra/db/repositories/user.repository';
import { JWTProvider } from '../../../user/infra/providers/jwt.provider';
import { UserNotFoundException } from '../../../user/domain/dtos/errors/UserNotFound.exception';
import { ActivityNotFoundException } from '../../domain/dtos/errors/ActivityNotFound.exception';
import { ActivityAlreadyAnsweredException } from '../../domain/dtos/errors/ActivityAlreadyAnswered.exception';
import { WrongAnswerException } from '../../domain/dtos/errors/WrongAnswer.exception';
import { UserActivityAnsweredRepository } from '../db/repositories/user-activities-answered.repository';
import { ActivityRepository } from '../../../activity/infra/db/repositories/activity.repository';
import { UserCourseConcludedRepository } from '../../../user-courses-concluded/infra/db/repositories/user-courses-concluded.repository';
import { CourseRepository } from '../../../course/infra/db/repositories/course.repository';
import { TestHelper } from '../../../../../test/helpers/dbInstanceHelper';

describe('UserActivitiesAnsweredService', () => {
  let userActivitiesAnsweredService: UserActivitiesAnsweredService;

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
        ActivityRepository,
        CourseRepository,
        JWTProvider,
        UserActivitiesAnsweredService,
        UserCourseConcludedRepository,
        UserActivityAnsweredRepository,
      ],
    }).compile();

    userActivitiesAnsweredService = module.get<UserActivitiesAnsweredService>(
      UserActivitiesAnsweredService,
    );
  });

  it('should not answer a question passing an user_id that does not exist', async () => {
    const user_id = 999;
    const activity_id = 1;
    const answer = '1';

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(
        user_id,
        activity_id,
        answer,
      );
    }).rejects.toThrow(UserNotFoundException);
  });

  it('should not answer a question passing an activity_id that does not exist', async () => {
    const user_id = 1;
    const activity_id = 999;
    const answer = '1';

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(
        user_id,
        activity_id,
        answer,
      );
    }).rejects.toThrow(ActivityNotFoundException);
  });

  it('should not answer a question that has already been answered', async () => {
    const user_id = 1;
    const activity_id = 1;
    const answer = '4';

    await userActivitiesAnsweredService.answerQuestion(
      user_id,
      activity_id,
      answer,
    );

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(
        user_id,
        activity_id,
        answer,
      );
    }).rejects.toThrow(ActivityAlreadyAnsweredException);
  });

  it('should not answer a question with a wrong answer', async () => {
    const user_id = 1;
    const activity_id = 2;
    const answer = '5';

    expect(async () => {
      await userActivitiesAnsweredService.answerQuestion(
        user_id,
        activity_id,
        answer,
      );
    }).rejects.toThrow(WrongAnswerException);
  });

  it('should answer a question with a correct answer', async () => {
    const user_id = 1;
    const activity_id = 2;
    const answer = '4';

    const result = await userActivitiesAnsweredService.answerQuestion(
      user_id,
      activity_id,
      answer,
    );

    expect(result).toBe(true);
  });
});
