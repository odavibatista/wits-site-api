import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ActivityRepository } from './activity.repository';
import { Activity } from '../infra/db/entity/activity.entity';

describe('Activity Repository Test Suites', () => {
    let activityRepository: ActivityRepository;

    const activity = new Activity(1, 1, 'What is the Capital of Brazil?', 'Brasília', 'São Paulo', 'Curitiba', 'Salvador', '1')
    const activity2 = new Activity(2, 1, 'What is the Capital of Argentina?', 'Buenos Aires', 'São Paulo', 'Curitiba', 'Salvador', '1')
    
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
            ActivityRepository,
            {
              provide: DataSource,
              useValue: dataSource,
            },
          ],
        }).compile();
    
        activityRepository = module.get<ActivityRepository>(ActivityRepository);
    });

    it('should not find an activity by its id using the getById passing an invalid id', async () => {
        const findOneSpy = jest
          .spyOn(activityRepository, 'findOne')
          .mockResolvedValue(null);
    
        const foundActivity = await activityRepository.findById(0);
    
        expect(foundActivity).toBe(null);
    });

    it('should find an activity by its id using the getById passing a valid id', async () => {
        const findOneSpy = jest
          .spyOn(activityRepository, 'findOne')
          .mockResolvedValue(activity);
    
        const foundActivity = await activityRepository.findById(1);
    
        expect(foundActivity).toBe(activity);
        expect(foundActivity).toHaveProperty('id_activity', 1);
        expect(foundActivity).toHaveProperty('course_id', 1);
        expect(foundActivity).toHaveProperty('question', 'What is the Capital of Brazil?');
        expect(foundActivity).toHaveProperty('option_1', 'Brasília');
        expect(foundActivity).toHaveProperty('option_2', 'São Paulo');
        expect(foundActivity).toHaveProperty('option_3', 'Curitiba');
        expect(foundActivity).toHaveProperty('option_4', 'Salvador');
        expect(foundActivity).toHaveProperty('correct_answer', '1');
    });

    it('should not find an activity by its course id using the getByCourseId passing an invalid course id', async () => {
        const findSpy = jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue([]);
    
        const foundActivity = await activityRepository.findByCourseId(0);
    
        expect(foundActivity).toEqual([]);
    })

    it('should find a batch of activities by the course id using the getByCourseId passing a valid course id', async () => {
        const findSpy = jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue([activity, activity2]);
    
        const foundActivity = await activityRepository.findByCourseId(1);
    
        expect(foundActivity).toEqual([activity, activity2]);
    })

    it('should find a batch of activities by the course id using the getByCourseId passing a valid course id and ordered by the most recent', async () => {
        const findSpy = jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue([activity2, activity]);
    
        const foundActivity = await activityRepository.findByCourseId(1, { created_at: 'DESC' });
    
        expect(foundActivity).toEqual([activity2, activity]);
    })

    it('should find a batch of activities by the course id using the getByCourseId passing a valid course id and ordered by the less recent', async () => {
        const findSpy = jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue([activity, activity2]);
    
        const foundActivity = await activityRepository.findByCourseId(1, { created_at: 'ASC' });
    
        expect(foundActivity).toEqual([activity, activity2]);
    })

    it('should return zero if there is no activity with the passed course id', async () => {
        const countSpy = jest.spyOn(activityRepository, 'count').mockResolvedValue(0);
    
        const count = await activityRepository.countByCourseId(0);
    
        expect(count).toBe(0);
    });

    it('should count a batch of activities by the course id', async () => {
        const countSpy = jest.spyOn(activityRepository, 'count').mockResolvedValue(2);
    
        const count = await activityRepository.countByCourseId(1);
    
        expect(count).toBe(2);
    });

    it('should not soft delete an activity passing an invalid id', async () => {
        const softDeleteSpy = jest.spyOn(activityRepository, 'softDelete').mockResolvedValue(undefined);
    
        const softDeleted = await activityRepository.softDeleteById(0);
    
        expect(softDeleted).toBe(undefined);
    });

    it('should soft delete an activity by its id', async () => {
        const softDeleteSpy = jest.spyOn(activityRepository, 'softDelete').mockResolvedValue(undefined);
    
        const softDeleted = await activityRepository.softDeleteById(1);
    
        expect(softDeleted).toBe(undefined);
    });

    it('should not bring a collection of activities passing an empty array', async () => {
        const findSpy = jest.spyOn(activityRepository, 'find').mockResolvedValue([]);
    
        const activities = await activityRepository.bringActivitiesCollection([]);
    
        expect(activities).toEqual([]);
    });

    it('should bring a collection of activities by their ids', async () => {
        const findSpy = jest.spyOn(activityRepository, 'find').mockResolvedValue([activity, activity2]);
    
        const activities = await activityRepository.bringActivitiesCollection([1, 2]);
    
        expect(activities).toEqual([
          {
            id_activity: 1,
            course_id: 1,
            question: 'What is the Capital of Brazil?',
            option_1: 'Brasília',
            option_2: 'São Paulo',
            option_3: 'Curitiba',
            option_4: 'Salvador',
            correct_answer: '1',
            created_at: activity.created_at,
          },
          {
            id_activity: 2,
            course_id: 1,
            question: 'What is the Capital of Argentina?',
            option_1: 'Buenos Aires',
            option_2: 'São Paulo',
            option_3: 'Curitiba',
            option_4: 'Salvador',
            correct_answer: '1',
            created_at: activity2.created_at,
          },
        ]);
    });
})