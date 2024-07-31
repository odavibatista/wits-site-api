import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from '../entity/user.entity';

describe('User Repository Test Suites', () => {
    let userRepository: UserRepository;

    const user = new User(1, 'username', 'email', 'password', 'admin');
    const user2 = new User(2, 'username2', 'email2', 'password2', 'common');

    const dataSource = {
        createEntityManager: jest.fn()
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
                UserRepository,
                {
                    provide: DataSource,
                    useValue: dataSource,
                },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
    })

    it('should not find an user by its id using the getById passing an invalid id', async () => {
        const findOneSpy = jest
            .spyOn(userRepository, 'findOne')
            .mockResolvedValue(null);
        
        const foundUser = await userRepository.findById(0);

        expect(foundUser).toBe(null);
    })

    it('should find an user by its id using the getById passing a valid id', async () => {
        const findOneSpy = jest
            .spyOn(userRepository, 'findOne')
            .mockResolvedValue(user);

        const foundUser = await userRepository.findById(1);

        expect(foundUser).toBe(user);
        expect(foundUser).toHaveProperty('id_user', 1);
        expect(foundUser).toHaveProperty('username', 'username');
        expect(foundUser).toHaveProperty('email', 'email');
        expect(foundUser).toHaveProperty('password', 'password');
        expect(foundUser).toHaveProperty('role', 'admin');
    })

    it('should not find an user by its username using the getByUsername passing an invalid username', async () => {
        const findOneSpy = jest
            .spyOn(userRepository, 'findOne')
            .mockResolvedValue(null);
        
        const foundUser = await userRepository.findByUsername('username');

        expect(foundUser).toBe(null);
    })

    it('should find an user by its username using the getByUsername passing a valid username', async () => {
        const findOneSpy = jest
            .spyOn(userRepository, 'findOne')
            .mockResolvedValue(user);

        const foundUser = await userRepository.findByUsername('username');

        expect(foundUser).toBe(user);
        expect(foundUser).toHaveProperty('username', 'username');
    })

    it('should not find an user by its email using the getByEmail passing an invalid email', async () => {
        const findOneSpy = jest
            .spyOn(userRepository, 'findOne')
            .mockResolvedValue(null);
        
        const foundUser = await userRepository.findByEmail('email');

        expect(foundUser).toBe(null);
    })

    it('should find an user by its email using the getByEmail passing a valid email', async () => {
        const findOneSpy = jest
            .spyOn(userRepository, 'findOne')
            .mockResolvedValue(user);

        const foundUser = await userRepository.findByEmail('email');

        expect(foundUser).toBe(user);
        expect(foundUser).toHaveProperty('email', 'email');
    })

    it('should not soft delete an user by its id', async () => {
        const softDeleteSpy = jest
            .spyOn(userRepository, 'softDelete')
            .mockResolvedValue(undefined);

        await userRepository.softDeleteById(0);

        expect(softDeleteSpy).toHaveBeenCalledWith(0);
    })

    it('should soft delete an user by its id', async () => {
        const softDeleteSpy = jest
            .spyOn(userRepository, 'softDelete')
            .mockResolvedValue(undefined);

        await userRepository.softDeleteById(1);

        expect(softDeleteSpy).toHaveBeenCalledWith(1);
    })

    it('should bring an empty user collection by its ids passing an unvalid id', async () => {
        const findSpy = jest
            .spyOn(userRepository, 'find')
            .mockResolvedValue([]);

        const users = await userRepository.bringUsersCollection([0]);

        expect(users).toEqual([]);
    })

    it('should bring an user collection by its ids', async () => {
        const findSpy = jest
            .spyOn(userRepository, 'find')
            .mockResolvedValue([user, user2]);

        const users = await userRepository.bringUsersCollection([1]);

        expect(users).toEqual([
            {
                id: 1,
                username: 'username',
            },
            {
                id: 2,
                username: 'username2',
            }
        ]);
    })
})