import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entity/user.entity';
import { UserCourseConcluded } from '../../user-courses-concluded/entity/user-courses-concluded.entity';
import { Activity } from '../../activity/entity/activity.entity';
import { CourseRepository } from '../repository/course.repository';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { JWTProvider } from '../../user/providers/jwt.provider';
import { UserActivityAnsweredRepository } from '../../user-activities-answered/repository/user-activities-answered.repository';
import {
  FindCoursesResponseDTO,
  FindIndividualCourseResponseDTO,
} from '../domain/requests/FindCourses.request.dto';
import { UserNotFoundException } from '../../user/domain/dtos/errors/UserNotFound.exception';
import { CourseNotFoundException } from '../domain/errors/CourseNotFound.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { UserRepository } from '../../user/repositories/user.repository';
import { TestHelper } from '../../../../test/helpers/dbInstanceHelper';

describe('Course Service Automated Tests', () => {
  let courseService: CourseService;

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
        JWTProvider,
        UserRepository,
      ],
    }).compile();

    courseService = module.get<CourseService>(CourseService);
  });

  it('should bring a page of courses', async () => {
    const courses = await courseService.getCourses(1);
    expect(courses).toBeInstanceOf(Array);
  });

  it('should not bring the course data for an user if the user does not exist', async () => {
    expect(async () => {
      await courseService.getCourseData(0, 1);
    }).rejects.toThrow(UserNotFoundException);
  });

  it('should not bring the course data for an user if the course does not exist', async () => {
    expect(async () => {
      await courseService.getCourseData(2, 0);
    }).rejects.toThrow(CourseNotFoundException);
  });

  it('should bring the course data for an user giving a valid user id and course id', async () => {
    const courseData = await courseService.getCourseData(2, 1);
    expect(courseData).toBeInstanceOf(FindIndividualCourseResponseDTO);
  });

  it('should not create a course if the name contains special characters', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with special characters @#$%',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a course if the name contains numbers', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with numbers 123',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a course if the name contains less than 5 characters', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: '1234',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a course if the name contains more than 25 characters', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with more than 25 characters',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a course passing a negative amount of points worth', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with negative points worth',
        points_worth: -100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a course passing a zero amount of points worth', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with zero points worth',
        points_worth: 0,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a course passing a decimal amount of points worth', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with decimal points worth',
        points_worth: 0.5,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not create a course passing an amount of points worth with more than 5 digits', async () => {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with more than 5 digits points worth',
        points_worth: 100000,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should create a course passing a valid course name and points worth', async () => {
    const course = await courseService.createCourse({
      course_name: 'Course with valid name',
      points_worth: 100,
    });

    expect(course).toHaveProperty('id_course');
    expect(course).toHaveProperty('course_name');
    expect(course).toHaveProperty('points_worth');
    expect(course).toHaveProperty('created_at');
  });

  it('should not edit a course passing an invalid course id', async () => {
    expect(async () => {
      await courseService.editCourse(0, {
        course_name: 'Course with valid name',
        points_worth: 100,
      });
    }).rejects.toThrow(CourseNotFoundException);
  });

  it('should not edit a course passing a name that contains special characters', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: 'Course with special characters @#$%',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit a course passing a name that contains numbers', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: 'Course with numbers 123',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit a course passing a name that contains less than 5 characters', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: '1234',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit a course passing a name that contains more than 25 characters', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: 'Course with more than 25 characters',
        points_worth: 100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit a course passing a negative amount of points worth', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: 'Course with negative points worth',
        points_worth: -100,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit a course passing a zero amount of points worth', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: 'Course with zero points worth',
        points_worth: 0,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit a course passing a decimal amount of points worth', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: 'Course with decimal points worth',
        points_worth: 0.5,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should not edit a course passing an amount of points worth with more than 5 digits', async () => {
    expect(async () => {
      await courseService.editCourse(1, {
        course_name: 'Course with more than 5 digits points worth',
        points_worth: 100000,
      });
    }).rejects.toThrow(UnprocessableDataException);
  });

  it('should edit a course passing a valid course name and points worth', async () => {
    const course = await courseService.editCourse(1, {
      course_name: 'Course with valid name',
      points_worth: 100,
    });

    expect(course).toHaveProperty('id_course');
    expect(course).toHaveProperty('course_name');
    expect(course).toHaveProperty('points_worth');
    expect(course).toHaveProperty('created_at');
  });

  it('should not delete a course passing an invalid course id', async () => {
    expect(async () => {
      await courseService.removeCourse(0);
    }).rejects.toThrow(CourseNotFoundException);
  });

  it('should delete a course passing a valid course id', async () => {
    const response = await courseService.removeCourse(1);

    expect(response).toBeTruthy();
  });
});
