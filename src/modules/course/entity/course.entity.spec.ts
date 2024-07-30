import { Test, TestingModule } from '@nestjs/testing';
import { Course } from './course.entity';
import { DatabaseModule } from '../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from '../repository/course.repository';

describe('Course Entity Test Suites', () => {

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Course]),
      ],
      providers: [
        CourseRepository,
      ],
    }).compile();

    const course = new Course(1, 'Course Name', 100)

    it('an instance of the Course class should have all of its attributes', async () => {
      expect(course).toHaveProperty('id_course')
      expect(course).toHaveProperty('course_name')
      expect(course).toHaveProperty('points_worth')
      expect(course).toHaveProperty('deleted_at')
      expect(course).toHaveProperty('created_at')
      expect(course).toHaveProperty('updated_at')
    })

    it('an instance of the Course class should have its id_course attribute being of type number', async () => {
      expect(course.id_course).toEqual(expect.any(Number))
    })

    it('an instance of the Course class should have its course_name attribute being of type string', async () => {
      expect(course.course_name).toEqual(expect.any(String))
    })

    it('an instance of the Course class should have its points_worth attribute being of type number', async () => {
      expect(course.points_worth).toEqual(expect.any(Number))
    })

    it('an instance of the Course class should have its deleted_at attribute being of type Date', async () => {
      expect(course.deleted_at).toEqual(expect.any(Date))
    })

    it('an instance of the Course class should have its created_at attribute being of type Date', async () => {
      expect(course.created_at).toEqual(expect.any(Date))
    })

    it('an instance of the Course class should have its updated_at attribute being of type Date', async () => {
      expect(course.updated_at).toEqual(expect.any(Date))
    })

  });
});
