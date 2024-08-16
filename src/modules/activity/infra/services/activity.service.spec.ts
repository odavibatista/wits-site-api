import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { DatabaseModule } from '../../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../db/entity/activity.entity';
import { UserCourseConcluded } from '../../../user-courses-concluded/entity/user-courses-concluded.entity';
import { User } from '../../user/entity/user.entity';
import { CourseService } from '../../../course/infra/services/course.service';
import { CourseRepository } from '../../course/repositories/course.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { UserCourseConcludedRepository } from '../../../user-courses-concluded/repository/user-courses-concluded.repository';
import { UserActivityAnsweredRepository } from '../../../user-activities-answered/repository/user-activities-answered.repository';
import { JWTProvider } from '../../user/providers/jwt.provider';
import { CourseNotFoundException } from '../../../course/domain/dtos/errors/CourseNotFound.exception';
import { UnprocessableDataException } from '../../../../shared/domain/errors/UnprocessableData.exception';
import { ActivityNotFoundException } from '../../domain/dtos/errors/ActivityNotFound.exception';
import { UserRepository } from '../../user/repositories/user.repository';
import { TestHelper } from '../../../../../test/helpers/dbInstanceHelper';

describe('Activity Service Tests Suite', () => {
  let activityService: ActivityService;

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
        TypeOrmModule.forFeature([Activity, UserCourseConcluded, User]),
      ],
      providers: [
        CourseService,
        CourseRepository,
        UserCourseConcludedRepository,
        ActivityRepository,
        UserActivityAnsweredRepository,
        UserRepository,
        ActivityService,
        JWTProvider,
      ],
    }).compile();

    activityService = module.get<ActivityService>(ActivityService);
  });

  it('should not bring the activities for a course if the course does not exist', async () => {
    expect(async () => {
      await activityService.getActivities(0);
    }).rejects.toThrow(CourseNotFoundException);
  });

  it('should bring the activities for a course if the course exists', async () => {
    const activities = await activityService.getActivities(1);
    expect(activities).toBeInstanceOf(Array);
  });

  it('should not bring the activity if the activity does not exist', async () => {
    expect(async () => {
      await activityService.getActivity(0);
    }).rejects.toThrow(ActivityNotFoundException);
  });

  it('should bring the activity given a valid id', async () => {
    const activity = await activityService.getActivity(1);

    expect(activity).toHaveProperty('id_activity');
    expect(activity).toHaveProperty('course_id');
    expect(activity).toHaveProperty('question');
    expect(activity).toHaveProperty('option_1');
    expect(activity).toHaveProperty('option_2');
    expect(activity).toHaveProperty('option_3');
    expect(activity).toHaveProperty('option_4');
    expect(activity).toHaveProperty('correct_answer');
    expect(activity).toHaveProperty('created_at');
    expect(activity).toHaveProperty('updated_at');
  });

  it('should not create an activity if the course does not exist', async () => {
    expect(async () => {
      await activityService.createActivity({
        course_id: 0,
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: '1',
      });
    }).rejects.toThrow(CourseNotFoundException);
  });

  it('should not create an activity if the correct answer is not a number', async () => {
    expect(async () => {
      await activityService.createActivity({
        course_id: 1,
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: 'Test',
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an activity if the correct answer is greater than 4', async () => {
    expect(async () => {
      await activityService.createActivity({
        course_id: 1,
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: '5',
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create an activity if the correct answer is less than 1', async () => {
    expect(async () => {
      await activityService.createActivity({
        course_id: 1,
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: '0',
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should create an activity if the data is valid', async () => {
    const activity = await activityService.createActivity({
      course_id: 1,
      question: 'Test',
      option_1: 'Test',
      option_2: 'Test',
      option_3: 'Test',
      option_4: 'Test',
      correct_answer: '1',
    });
    expect(activity).toHaveProperty('id_activity');
    expect(activity).toHaveProperty('course_id');
    expect(activity).toHaveProperty('question');
    expect(activity).toHaveProperty('option_1');
    expect(activity).toHaveProperty('option_2');
    expect(activity).toHaveProperty('option_3');
    expect(activity).toHaveProperty('option_4');
    expect(activity).toHaveProperty('correct_answer');
    expect(activity).toHaveProperty('created_at');
  });

  it('should not edit an activity if the activity does not exist', async () => {
    expect(async () => {
      await activityService.editActivity(0, {
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: '1',
      });
    }).rejects.toThrow(ActivityNotFoundException);
  });

  it('shoud not edit the activity if the correct answer is not a number', async () => {
    expect(async () => {
      await activityService.editActivity(1, {
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: 'Test',
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit the activity if the correct answer is greater than 4', async () => {
    expect(async () => {
      await activityService.editActivity(1, {
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: '5',
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit the activity if the correct answer is less than 1', async () => {
    expect(async () => {
      await activityService.editActivity(1, {
        question: 'Test',
        option_1: 'Test',
        option_2: 'Test',
        option_3: 'Test',
        option_4: 'Test',
        correct_answer: '0',
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should edit the activity if the data is valid', async () => {
    const activity = await activityService.editActivity(1, {
      question: 'Test',
      option_1: 'Test',
      option_2: 'Test',
      option_3: 'Test',
      option_4: 'Test',
      correct_answer: '1',
    });
    expect(activity).toHaveProperty('id_activity');
    expect(activity).toHaveProperty('course_id');
    expect(activity).toHaveProperty('question');
    expect(activity).toHaveProperty('option_1');
    expect(activity).toHaveProperty('option_2');
    expect(activity).toHaveProperty('option_3');
    expect(activity).toHaveProperty('option_4');
    expect(activity).toHaveProperty('correct_answer');
    expect(activity).toHaveProperty('created_at');
  });

  it('should not remove an activity if the activity does not exist', async () => {
    expect(async () => {
      await activityService.removeActivity(0);
    }).rejects.toThrow(ActivityNotFoundException);
  });

  it('should remove an activity if the activity exists', async () => {
    const response = await activityService.removeActivity(1);

    expect(response).toBeTruthy();
  });
});
