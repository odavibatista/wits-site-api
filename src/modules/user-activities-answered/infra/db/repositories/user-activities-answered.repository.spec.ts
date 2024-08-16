import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserActivityAnsweredRepository } from './user-activities-answered.repository';
import { UserActivityAnswered } from '../entity/user-activities-answered.entity';

describe('UserActivityAnswered Repository Test Suites', () => {
    let userActivityAnsweredRepository: UserActivityAnsweredRepository;

    const userActivityAnswered1 = new UserActivityAnswered(1, 1)
        
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
            UserActivityAnsweredRepository,
            {
              provide: DataSource,
              useValue: dataSource,
            },
          ],
        }).compile();
    
        userActivityAnsweredRepository = module.get<UserActivityAnsweredRepository>(UserActivityAnsweredRepository);
    });

    it('should not find an answered activity by its user_id and activity_id using the findAnsweredActivity passing an invalid user id', async () => {
        const findOneSpy = jest
          .spyOn(userActivityAnsweredRepository, 'findOne')
          .mockResolvedValue(null);
    
        const foundActivityAnswered = await userActivityAnsweredRepository.findAnsweredActivity(0, 1);
    
        expect(foundActivityAnswered).toBe(null);
    });

    it('should not find an answered activity by its user_id and activity_id using the findAnsweredActivity passing an invalid activity id', async () => {
        const findOneSpy = jest
          .spyOn(userActivityAnsweredRepository, 'findOne')
          .mockResolvedValue(null);
    
        const foundActivityAnswered = await userActivityAnsweredRepository.findAnsweredActivity(1, 0);
    
        expect(foundActivityAnswered).toBe(null);
    });

    it('should find an answered activity by its user_id and activity_id using the findAnsweredActivity passing valid ids', async () => {
        const findOneSpy = jest
          .spyOn(userActivityAnsweredRepository, 'findOne')
          .mockResolvedValue(userActivityAnswered1);
    
        const foundActivityAnswered = await userActivityAnsweredRepository.findAnsweredActivity(1, 1);
    
        expect(foundActivityAnswered).toBe(userActivityAnswered1);
        expect(foundActivityAnswered).toHaveProperty('user_id', 1);
        expect(foundActivityAnswered).toHaveProperty('activity_id', 1);
        expect(foundActivityAnswered).toHaveProperty('created_at');
        expect(foundActivityAnswered).toHaveProperty('updated_at');
        expect(foundActivityAnswered).toHaveProperty('deleted_at');
    });
})