import { Test, TestingModule } from '@nestjs/testing';
import { UserCoursesConcludedDtoService } from './user-courses-concluded.dto.service';

describe('UserCoursesConcludedDtoService', () => {
  let service: UserCoursesConcludedDtoService;

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
