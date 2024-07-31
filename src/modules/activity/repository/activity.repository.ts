import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsOrder, In, Repository } from 'typeorm';
import { Activity } from '../entity/activity.entity';
import { FindActivitiesCollectionResponseDTO } from '../domain/requests/FindActivitiesCollection.request.dto';

@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(private dataSource: DataSource) {
    super(Activity, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Activity | null> {
    return this.findOne({ where: { id_activity: id } });
  }

  async findByCourseId(
    course_id: number,
    order?: FindOptionsOrder<Activity>,
  ): Promise<Activity[]> {
    return this.find({ where: { course_id }, order });
  }

  async countByCourseId(course_id: number): Promise<number> {
    return this.count({ where: { course_id } });
  }

  async softDeleteById(id: number): Promise<true> {
    await this.softDelete(id);
    return;
  }

  async bringActivitiesCollection(
    activity_ids: number[],
  ): Promise<FindActivitiesCollectionResponseDTO> {
    const activities = await this.find({
      where: { id_activity: In(activity_ids) },
    });

    return activities.map((activity) => ({
      id_activity: activity.id_activity,
      course_id: activity.course_id,
      question: activity.question,
      option_1: activity.option_1,
      option_2: activity.option_2,
      option_3: activity.option_3,
      option_4: activity.option_4,
      correct_answer: activity.correct_answer,
      created_at: activity.created_at,
    }));
  }
}
