import { User } from './user.entity';

describe('User Entity Test Suites', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const adminUser = new User(1, 'username', 'email', 'password', 'admin');
  const commonUser = new User(2, 'username', 'email', 'password', 'common');

  it('an instance of the User class should have all of its attributes', async () => {
    expect(adminUser).toHaveProperty('id_user');
    expect(adminUser).toHaveProperty('username');
    expect(adminUser).toHaveProperty('email');
    expect(adminUser).toHaveProperty('password');
    expect(adminUser).toHaveProperty('role');
    expect(adminUser).toHaveProperty('deleted_at');
    expect(adminUser).toHaveProperty('created_at');
    expect(adminUser).toHaveProperty('updated_at');
  });

  it('an instance of the User class should have its id_user attribute being of type number', async () => {
    expect(adminUser.id_user).toEqual(expect.any(Number));
  });

  it('an instance of the User class should have its username attribute being of type string', async () => {
    expect(adminUser.username).toEqual(expect.any(String));
  });

  it('an instance of the User class should have its email attribute being of type string', async () => {
    expect(adminUser.email).toEqual(expect.any(String));
  });

  it('an instance of the User class should have its password attribute being of type string', async () => {
    expect(adminUser.password).toEqual(expect.any(String));
  });

  it('an instance of the User class should have its role attribute being of type string', async () => {
    expect(adminUser.role).toEqual(expect.any(String));
  });

  it('an instance of the User class should have its deleted_at attribute being null', async () => {
    expect(adminUser.deleted_at).toBeNull();
  });

  it('an instance of the User class should have its created_at attribute being of type Date', async () => {
    expect(adminUser.created_at).toEqual(expect.any(Date));
  });

  it('an instance of the User class should have its updated_at attribute being of type Date', async () => {
    expect(adminUser.updated_at).toEqual(expect.any(Date));
  });

  it('an instance of the User class should have its role attribute being "common" or "admin"', async () => {
    expect(commonUser.role).toMatch(/^(common|admin)$/);
    expect(adminUser.role).toMatch(/^(common|admin)$/);
  });
});
