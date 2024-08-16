import { Test, TestingModule } from '@nestjs/testing';
import { UserCoursesConcludedDtoService } from './user-courses-concluded.dto.service';
import { TestHelper } from '../../../../../test/helpers/dbInstanceHelper';

describe('UserCoursesConcludedDtoService', () => {
  let service: UserCoursesConcludedDtoService;

  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
  });

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  afterAll(() => {
    jest.useRealTimers();
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCoursesConcludedDtoService],
    }).compile();

    service = module.get<UserCoursesConcludedDtoService>(
      UserCoursesConcludedDtoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
