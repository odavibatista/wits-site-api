import { Test, TestingModule } from '@nestjs/testing';
import { UserActivitiesAnsweredService } from './user-activities-answered.service';

describe('UserActivitiesAnsweredService', () => {
  let service: UserActivitiesAnsweredService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserActivitiesAnsweredService],
    }).compile();

    service = module.get<UserActivitiesAnsweredService>(
      UserActivitiesAnsweredService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
