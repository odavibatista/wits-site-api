import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { CourseRepository } from './course.repository';
import { Course } from '../entity/course.entity';

describe('Course Repository Test Suites', () => {
  let courseRepository: CourseRepository;

  const course = new Course(1, 'course', 100);
  const course2 = new Course(2, 'course2', 200);

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    courseRepository = module.get<CourseRepository>(CourseRepository);
  });

  it('should not find a course by its id using the getById passing an invalid id', async () => {
    const findOneSpy = jest
      .spyOn(courseRepository, 'findOne')
      .mockResolvedValue(null);

    const foundCourse = await courseRepository.findById(0);

    expect(foundCourse).toBe(null);
  });

  it('should find a course by its id using the getById passing a valid id', async () => {
    const findOneSpy = jest
      .spyOn(courseRepository, 'findOne')
      .mockResolvedValue(course);

    const foundCourse = await courseRepository.findById(1);

    expect(foundCourse).toBe(course);
    expect(foundCourse).toHaveProperty('id_course', 1);
    expect(foundCourse).toHaveProperty('course_name', 'course');
    expect(foundCourse).toHaveProperty('points_worth', 100);
  });

  it('should not find a course by its name using the getByName passing an invalid name', async () => {
    const findOneSpy = jest
      .spyOn(courseRepository, 'findOne')
      .mockResolvedValue(null);

    const foundCourse = await courseRepository.findByName('invalid');

    expect(foundCourse).toBe(null);
  });

  it('should find a course by its name using the getByName passing a valid name', async () => {
    const findOneSpy = jest
      .spyOn(courseRepository, 'findOne')
      .mockResolvedValue(course);

    const foundCourse = await courseRepository.findByName('course');

    expect(foundCourse).toBe(course);
    expect(foundCourse).toHaveProperty('id_course', 1);
    expect(foundCourse).toHaveProperty('course_name', 'course');
    expect(foundCourse).toHaveProperty('points_worth', 100);
  });

  it('should return zero if there is no course with the passed id', async () => {
    const countSpy = jest.spyOn(courseRepository, 'count').mockResolvedValue(0);

    const count = await courseRepository.countById(0);

    expect(count).toBe(0);
  });

  it('should count a course by its id', async () => {
    const countSpy = jest.spyOn(courseRepository, 'count').mockResolvedValue(1);

    const count = await courseRepository.countById(1);

    expect(count).toBe(1);
  });

  it('should not soft delete a course passing an invalid id', async () => {
    const softDeleteSpy = jest
      .spyOn(courseRepository, 'softDelete')
      .mockResolvedValue(undefined);

    const softDeleted = await courseRepository.softDeleteById(0);

    expect(softDeleted).toBe(undefined);
  });

  it('should soft delete a course by its id', async () => {
    const softDeleteSpy = jest
      .spyOn(courseRepository, 'softDelete')
      .mockResolvedValue(undefined);

    const softDeleted = await courseRepository.softDeleteById(1);

    expect(softDeleted).toBe(undefined);
  });

  it('should not bring a collection of courses passing an empty array', async () => {
    const findSpy = jest.spyOn(courseRepository, 'find').mockResolvedValue([]);

    const courses = await courseRepository.bringCoursesCollection([]);

    expect(courses).toEqual([]);
  });

  it('should bring a collection of courses by their ids', async () => {
    const findSpy = jest
      .spyOn(courseRepository, 'find')
      .mockResolvedValue([course, course2]);

    const courses = await courseRepository.bringCoursesCollection([1]);

    expect(courses).toEqual([
      {
        id_course: 1,
        course_name: 'course',
        points_worth: 100,
        created_at: course.created_at,
      },
      {
        id_course: 2,
        course_name: 'course2',
        points_worth: 200,
        created_at: course2.created_at,
      },
    ]);
  });

  it('should bring a collection of courses by their ids and ordered by the most recent', async () => {
    const findSpy = jest
      .spyOn(courseRepository, 'find')
      .mockResolvedValue([course2, course]);

    const courses = await courseRepository.bringCoursesCollection([1], {
      created_at: 'DESC',
    });

    expect(courses).toEqual([
      {
        id_course: 2,
        course_name: 'course2',
        points_worth: 200,
        created_at: course2.created_at,
      },
      {
        id_course: 1,
        course_name: 'course',
        points_worth: 100,
        created_at: course.created_at,
      },
    ]);
  })

    it('should bring a collection of courses by their ids and ordered by the least recent', async () => {
        const findSpy = jest
        .spyOn(courseRepository, 'find')
        .mockResolvedValue([course, course2]);
    
        const courses = await courseRepository.bringCoursesCollection([1], {
        created_at: 'ASC',
        });
    
        expect(courses).toEqual([
        {
            id_course: 1,
            course_name: 'course',
            points_worth: 100,
            created_at: course.created_at,
        },
        {
            id_course: 2,
            course_name: 'course2',
            points_worth: 200,
            created_at: course2.created_at,
        },
        ]);
    });
});
