import { UserActivityAnswered } from './user-activities-answered.entity';

describe('User`s Activities Answers Test Suites', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const userActivityAnswered = new UserActivityAnswered(1, 1);

  it('an instance of the UserActivityAnswered class should have all of its attributes', async () => {
    expect(userActivityAnswered).toHaveProperty('user_id');
    expect(userActivityAnswered).toHaveProperty('activity_id');
    expect(userActivityAnswered).toHaveProperty('deleted_at');
    expect(userActivityAnswered).toHaveProperty('created_at');
    expect(userActivityAnswered).toHaveProperty('updated_at');
  })

  it('an instance of the UserActivityAnswered class should have its user_id attribute being of type number', async () => {
    expect(userActivityAnswered.user_id).toEqual(expect.any(Number));
  })

  it('an instance of the UserActivityAnswered class should have its activity_id attribute being of type number', async () => {
    expect(userActivityAnswered.activity_id).toEqual(expect.any(Number));
  })

  it('an instance of the UserActivityAnswered class should have its deleted_at attribute being null', async () => {
    expect(userActivityAnswered.deleted_at).toBeNull();
  })

  it('an instance of the UserActivityAnswered class should have its created_at attribute being of type Date', async () => {
    expect(userActivityAnswered.created_at).toEqual(expect.any(Date));
  })

  it('an instance of the UserActivityAnswered class should have its updated_at attribute being of type Date', async () => {
    expect(userActivityAnswered.updated_at).toEqual(expect.any(Date));
  })
});
