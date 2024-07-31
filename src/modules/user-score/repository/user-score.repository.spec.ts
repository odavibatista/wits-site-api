import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserScoreRepository } from './user-score.repository';
import { UserScore } from '../entity/user-score.entity';

describe('UserScore Repository Test Suites', () => {
    let userScoreRepository: UserScoreRepository;

    const score1 = new UserScore(1, 100)
    const score2 = new UserScore(2, 200)
    const score3 = new UserScore(3, 300)
        
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
            UserScoreRepository,
            {
              provide: DataSource,
              useValue: dataSource,
            },
          ],
        }).compile();
    
        userScoreRepository = module.get<UserScoreRepository>(UserScoreRepository);
    });

    it('should not find a user score by its id using the findByUserId passing an invalid id', async () => {
        const findOneSpy = jest
          .spyOn(userScoreRepository, 'findOne')
          .mockResolvedValue(null);
    
        const foundScore = await userScoreRepository.findByUserId(0);
    
        expect(foundScore).toBe(null);
    });

    it('should find a user score by its id using the findByUserId passing a valid id', async () => {
        const findOneSpy = jest
          .spyOn(userScoreRepository, 'findOne')
          .mockResolvedValue(score1);
    
        const foundScore = await userScoreRepository.findByUserId(1);
    
        expect(foundScore).toBe(score1);
        expect(foundScore).toHaveProperty('user_id', 1);
        expect(foundScore).toHaveProperty('total_score', 100);
    });

    it('should add a score to a user using the addScore passing a valid id and a valid score', async () => {
        const findOneSpy = jest
          .spyOn(userScoreRepository, 'findByUserId')
          .mockResolvedValue(score1);
    
        const saveSpy = jest
          .spyOn(userScoreRepository, 'save')
          .mockResolvedValue(undefined);
    
        const updatedScore = await userScoreRepository.addScore(1, 100);
    
        expect(updatedScore).toBe(undefined);
    });
})