import { Activity } from './activity.entity';

describe('Activity Entity Test Suites', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const activity = new Activity(1, 1, 'Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', '1')

  it('an instance of the Activity class should have all of its attributes', async () => {
    expect(activity).toHaveProperty('id_activity')
    expect(activity).toHaveProperty('course_id')
    expect(activity).toHaveProperty('question')
    expect(activity).toHaveProperty('option_1')
    expect(activity).toHaveProperty('option_2')
    expect(activity).toHaveProperty('option_3')
    expect(activity).toHaveProperty('option_4')
    expect(activity).toHaveProperty('correct_answer')
    expect(activity).toHaveProperty('deleted_at')
    expect(activity).toHaveProperty('created_at')
    expect(activity).toHaveProperty('updated_at')
  })
  
  it('an instance of the Activity class should have its id_activity attribute being of type number', async () => {
    expect(activity.id_activity).toEqual(expect.any(Number))
  })

  it('an instance of the Activity class should have its course_id attribute being of type number', async () => {
    expect(activity.course_id).toEqual(expect.any(Number))
  })

  it('an instance of the Activity class should have its question attribute being of type string', async () => {
    expect(activity.question).toEqual(expect.any(String))
  })

  it('an instance of the Activity class should have its option_1 attribute being of type string', async () => {
    expect(activity.option_1).toEqual(expect.any(String))
  })

  it('an instance of the Activity class should have its option_2 attribute being of type string', async () => {
    expect(activity.option_2).toEqual(expect.any(String))
  })

  it('an instance of the Activity class should have its option_3 attribute being of type string', async () => {
    expect(activity.option_3).toEqual(expect.any(String))
  })

  it('an instance of the Activity class should have its option_4 attribute being of type string', async () => {
    expect(activity.option_4).toEqual(expect.any(String))
  })

  it('an instance of the Activity class should have its correct_answer attribute being of type string', async () => {
    expect(activity.correct_answer).toEqual(expect.any(String))
  })

  it('an instance of the Activity class should have its created_at attribute set to a Date object', async () => {
    expect(activity.created_at).toBeInstanceOf(Date)
  })

  it('an instance of the Activity class should have its updated_at attribute set to a Date object', async () => {
    expect(activity.updated_at).toBeInstanceOf(Date)
  })

  it('an instance of the Activity class should have its deleted_at attribute set to null', async () => {
    expect(activity.deleted_at).toBeNull()
  })
});
