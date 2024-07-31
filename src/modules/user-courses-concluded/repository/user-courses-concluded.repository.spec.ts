import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserCourseConcludedRepository } from './user-courses-concluded.repository';
import { UserCourseConcluded } from '../entity/user-courses-concluded.entity';

describe('UserCourseConcluded Repository Test Suites', () => {
    let userCourseConcludedRepository: UserCourseConcludedRepository;

    const userCourseConcluded1 = new UserCourseConcluded(1, 1)
    const userCourseConcluded2 = new UserCourseConcluded(1, 2)
    const userCourseConcluded3 = new UserCourseConcluded(2, 1)
    const userCourseConcluded4 = new UserCourseConcluded(2, 2)

        
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
            UserCourseConcludedRepository,
            {
              provide: DataSource,
              useValue: dataSource,
            },
          ],
        }).compile();
    
        userCourseConcludedRepository = module.get<UserCourseConcludedRepository>(UserCourseConcludedRepository);
    });

    it('should not find a concluded course by its user_id and course_id using the findConcludedCourse passing an invalid user id', async () => {
        const findOneSpy = jest
          .spyOn(userCourseConcludedRepository, 'findOne')
          .mockResolvedValue(null);
    
        const foundCourseConcluded = await userCourseConcludedRepository.findConcludedCourse(0, 1);
    
        expect(foundCourseConcluded).toBe(null);
    });

    it('should not find a concluded course by its user_id and course_id using the findConcludedCourse passing an invalid course id', async () => {
        const findOneSpy = jest
          .spyOn(userCourseConcludedRepository, 'findOne')
          .mockResolvedValue(null);
    
        const foundCourseConcluded = await userCourseConcludedRepository.findConcludedCourse(1, 0);
    
        expect(foundCourseConcluded).toBe(null);
    });

    it('should find a concluded course by its user_id and course_id using the findConcludedCourse passing valid ids', async () => {
        const findOneSpy = jest
          .spyOn(userCourseConcludedRepository, 'findOne')
          .mockResolvedValue(userCourseConcluded1);

        const foundCourseConcluded = await userCourseConcludedRepository.findConcludedCourse(1, 1);
    
        expect(foundCourseConcluded).toBe(userCourseConcluded1);
        expect(foundCourseConcluded).toHaveProperty('user_id', 1);
        expect(foundCourseConcluded).toHaveProperty('course_id', 1);
    });

    it('should return 0 when counting the number of concluded courses by a user using the countUserConcludedCourses passing an invalid user id', async () => {
        const countSpy = jest
          .spyOn(userCourseConcludedRepository, 'count')
          .mockResolvedValue(0);
    
        const count = await userCourseConcludedRepository.countUserConcludedCourses(0);
    
        expect(count).toBe(0);
    })

    it('should return all concluded courses by a user using the countUserConcludedCourses passing a valid user id', async () => {
        const countSpy = jest
          .spyOn(userCourseConcludedRepository, 'count')
          .mockResolvedValue(2);
    
        const count = await userCourseConcludedRepository.countUserConcludedCourses(1);
    
        expect(count).toBe(2);
    })

    it('should return 0 counting a course`s global conclusion using the countCourseGlobalConclusions passing an invalid course id', async () => {
        const countSpy = jest
          .spyOn(userCourseConcludedRepository, 'count')
          .mockResolvedValue(0);
    
        const count = await userCourseConcludedRepository.countCourseGlobalConclusions(0);
    
        expect(count).toBe(0);
    })

    it('should return all course`s global conclusions using the countCourseGlobalConclusions passing a valid course id', async () => {
        const countSpy = jest
          .spyOn(userCourseConcludedRepository, 'count')
          .mockResolvedValue(2);
    
        const count = await userCourseConcludedRepository.countCourseGlobalConclusions(1);
    
        expect(count).toBe(2);
    })
})