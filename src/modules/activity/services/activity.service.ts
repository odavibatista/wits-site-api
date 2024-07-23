import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repository/activity.repository';
import { Activity } from '../entity/activity.entity';
import { CourseNotFoundException } from '../../course/domain/errors/CourseNotFound.exception';
import { CourseRepository } from '../../course/repository/course.repository';
import {
  CreateActivityRequestDTO,
  CreateActivityResponseDTO,
} from '../domain/requests/CreateActivity.request.dto';
import {
  EditActivityRequestDTO,
  EditActivityResponseDTO,
} from '../domain/requests/EditActivity.request.dto';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async getActivities(course_id: number): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { course_id },
      order: { created_at: 'ASC' },
    });
  }

  async createActivity(
    activityData: CreateActivityRequestDTO,
  ): Promise<CreateActivityResponseDTO | CourseNotFoundException> {
    const course = await this.courseRepository.findOne({
      where: { id_course: activityData.course_id },
    });

    if (!course) throw new CourseNotFoundException();

    return {
      ...(await this.activityRepository.save(activityData)),
    };
  }

  async editActivity(
    id: number,
    activityData: EditActivityRequestDTO,
  ): Promise<EditActivityResponseDTO | ActivityNotFoundException> {
    const activity = await this.activityRepository.findOne({
      where: { id_activity: id },
    });

    if (!activity) throw new ActivityNotFoundException();

    return {
      ...(await this.activityRepository.save(activityData)),
    };
  }

  async removeActivity(id: number): Promise<void | ActivityNotFoundException> {
    const activity = await this.activityRepository.findOne({
      where: { id_activity: id },
    });

    if (!activity) throw new ActivityNotFoundException();

    await this.activityRepository.softDelete(id);
  }
}
