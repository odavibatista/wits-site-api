import { Test, TestingModule } from '@nestjs/testing';
import { ConjunctCoursesController } from './course.controller';

describe('CourseController', () => {
  let controller: ConjunctCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConjunctCoursesController],
    }).compile();

    controller = module.get<ConjunctCoursesController>(
      ConjunctCoursesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
