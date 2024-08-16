import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repository/activity.repository';
import { Activity } from '../entity/activity.entity';
import { CourseNotFoundException } from '../../course/domain/dtos/errors/CourseNotFound.exception';
import { CourseRepository } from '../../course/repositories/course.repository';
import {
  CreateActivityRequestDTO,
  CreateActivityResponseDTO,
} from '../domain/requests/CreateActivity.request.dto';
import {
  EditActivityRequestDTO,
  EditActivityResponseDTO,
} from '../domain/requests/EditActivity.request.dto';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async getActivities(
    course_id: number,
  ): Promise<Activity[] | CourseNotFoundException> {
    const course = await this.courseRepository.findById(course_id);

    if (!course) throw new CourseNotFoundException();

    return await this.activityRepository.findByCourseId(course_id, {
      created_at: 'ASC',
    });
  }

  async createActivity(
    activityData: CreateActivityRequestDTO,
  ): Promise<CreateActivityResponseDTO | CourseNotFoundException> {
    if (
      activityData.correct_answer.length < 1 ||
      activityData.correct_answer.length > 1 ||
      isNaN(Number(activityData.correct_answer)) ||
      Number(activityData.correct_answer) > 4 ||
      Number(activityData.correct_answer) < 1
    )
      throw new UnprocessableDataException(
        'Insira o número válido da resposta correta (entre 1 e 4).',
      );

    const course = await this.courseRepository.findById(activityData.course_id);

    if (!course) throw new CourseNotFoundException();

    return {
      ...(await this.activityRepository.save(activityData)),
    };
  }

  async getActivity(id: number): Promise<Activity | ActivityNotFoundException> {
    const activity = await this.activityRepository.findById(id);

    if (!activity) throw new ActivityNotFoundException();

    return activity;
  }

  async editActivity(
    id: number,
    activityData: EditActivityRequestDTO,
  ): Promise<EditActivityResponseDTO | ActivityNotFoundException> {
    if (
      activityData.correct_answer.length < 1 ||
      activityData.correct_answer.length > 1 ||
      isNaN(Number(activityData.correct_answer)) ||
      Number(activityData.correct_answer) > 4 ||
      Number(activityData.correct_answer) < 1
    )
      throw new UnprocessableDataException(
        'Insira o número válido da resposta correta (entre 1 e 4).',
      );

    const activity = await this.activityRepository.findById(id);

    if (!activity) throw new ActivityNotFoundException();

    return {
      ...(await this.activityRepository.save(activityData)),
    };
  }

  async removeActivity(id: number): Promise<void | ActivityNotFoundException> {
    const activity = await this.activityRepository.findById(id);

    if (!activity) throw new ActivityNotFoundException();

    await this.activityRepository.softDelete(id);
  }
}
