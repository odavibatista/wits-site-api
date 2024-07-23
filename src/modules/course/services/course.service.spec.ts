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
import { FindCoursesResponseDTO, FindIndividualCourseResponseDTO } from '../domain/requests/FindCourses.request.dto';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';
import { CourseNotFoundException } from '../domain/errors/CourseNotFound.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';

describe('CourseService', () => {
  let courseService: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
          Activity, UserCourseConcluded, User,
        ]),
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

    courseService = module.get<CourseService>(CourseService);
  });

  it('should bring a page of courses', async () => {
    const courses = await courseService.getCourses(1);
    expect(courses).toBeInstanceOf(Array);
    expect(courses).toBeInstanceOf(FindCoursesResponseDTO);
  })

  it('should not bring the course data for an user if the user does not exist', async() => {
    expect(async () =>  {
      await courseService.getCourseData(0, 1);
    }).rejects.toThrow(UserNotFoundException)
  })

  it('should not bring the course data for an user if the course does not exist', async() => {
    expect(async () => {
      await courseService.getCourseData(2, 0);
    }).rejects.toThrow(CourseNotFoundException)
  })

  it('should bring the course data for an user giving a valid user id and course id', async() => {
    const courseData = await courseService.getCourseData(2, 1);
    expect(courseData).toBeInstanceOf(FindIndividualCourseResponseDTO);
  })

  it('should not create a course if the name contains special characters', async () =>  {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with special characters @#$%',
        points_worth: 100
      });
    }).rejects.toThrow(UnprocessableDataException)
  })

  it('should not create a course if the name contains numbers', async ()  =>  {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with numbers 123',
        points_worth: 100
      });
    }).rejects.toThrow(UnprocessableDataException)
  })

  it('should not create a course if the name contains less than 5 characters', async () =>  {
    expect(async () => {
      await courseService.createCourse({
        course_name: '1234',
        points_worth: 100
      });
    }).rejects.toThrow(UnprocessableDataException)
  })

  it('should not create a course if the name contains more than 25 characters', async () =>  {
    expect(async () => {
      await courseService.createCourse({
        course_name: 'Course with more than 25 characters',
        points_worth: 100
      });
    }).rejects.toThrow(UnprocessableDataException)
  })
});
