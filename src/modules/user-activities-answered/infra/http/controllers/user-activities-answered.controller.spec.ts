import { Test, TestingModule } from '@nestjs/testing';
import { UserActivitiesAnsweredController } from './user-activities-answered.controller';

describe('UserActivitiesAnsweredController', () => {
  let controller: UserActivitiesAnsweredController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActivitiesAnsweredController],
    }).compile();

    controller = module.get<UserActivitiesAnsweredController>(
      UserActivitiesAnsweredController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
