import { UserCourseConcluded } from './user-courses-concluded.entity';

describe('Users`s courses conclusion Test Suites', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const userCourseConcluded = new UserCourseConcluded(1, 1);

  it('an instance of the UserCourseConcluded class should have all of its attributes', async () => {
    expect(userCourseConcluded).toHaveProperty('user_id');
    expect(userCourseConcluded).toHaveProperty('course_id');
    expect(userCourseConcluded).toHaveProperty('deleted_at');
    expect(userCourseConcluded).toHaveProperty('created_at');
    expect(userCourseConcluded).toHaveProperty('updated_at');
  });

  it('an instance of the UserCourseConcluded class should have its user_id attribute being of type number', async () => {
    expect(userCourseConcluded.user_id).toEqual(expect.any(Number));
  });

  it('an instance of the UserCourseConcluded class should have its course_id attribute being of type number', async () => {
    expect(userCourseConcluded.course_id).toEqual(expect.any(Number));
  });

  it('an instance of the UserCourseConcluded class should have its deleted_at attribute being null', async () => {
    expect(userCourseConcluded.deleted_at).toBeNull();
  });

  it('an instance of the UserCourseConcluded class should have its created_at attribute being of type Date', async () => {
    expect(userCourseConcluded.created_at).toEqual(expect.any(Date));
  });

  it('an instance of the UserCourseConcluded class should have its updated_at attribute being of type Date', async () => {
    expect(userCourseConcluded.updated_at).toEqual(expect.any(Date));
  });
});
