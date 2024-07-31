import { UserScore } from './user-score.entity';

describe('User Score Entity Test Suites', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const score = new UserScore(1, 100);

  it('an instance of the UserScore class should have all of its attributes', async () => {
    expect(score).toHaveProperty('user_id');
    expect(score).toHaveProperty('total_score');
    expect(score).toHaveProperty('created_at');
    expect(score).toHaveProperty('updated_at');
  });

  it('an instance of the UserScore class should have its user_id attribute being of type number', async () => {
    expect(score.user_id).toEqual(expect.any(Number));
  });

  it('an instance of the UserScore class should have its total_score attribute being of type number', async () => {
    expect(score.total_score).toEqual(expect.any(Number));
  });

  it('an instance of the UserScore class should have its created_at attribute being of type Date', async () => {
    expect(score.created_at).toEqual(expect.any(Date));
  });

  it('an instance of the UserScore class should have its updated_at attribute being of type Date', async () => {
    expect(score.updated_at).toEqual(expect.any(Date));
  });

  it('an instance of the UserScore class should have its deleted_at attribute being null', async () => {
    expect(score.deleted_at).toBeNull();
  });
});
