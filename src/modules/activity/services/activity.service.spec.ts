import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../entity/activity.entity';
import { UserCourseConcluded } from '../../user-courses-concluded/entity/user-courses-concluded.entity';
import { User } from '../../user/entity/user.entity';
import { CourseService } from '../../course/services/course.service';
import { CourseRepository } from '../../course/repository/course.repository';
import { ActivityRepository } from '../repository/activity.repository';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { UserActivityAnsweredRepository } from '../../user-activities-answered/repository/user-activities-answered.repository';
import { JWTProvider } from '../../user/providers/jwt.provider';
import { CourseNotFoundException } from '../../course/domain/errors/CourseNotFound.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';

describe('Activity Service Tests Suite', () => {
  let activityService: ActivityService;

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
  })

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
    expect(activity).toBeDefined();
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
  })

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
    expect(activity).toBeDefined();
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
