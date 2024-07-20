import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Activity } from '../entity/activity.entity';
import {
  course_1_activities,
  course_2_activities,
  course_3_activities,
  course_4_activities,
} from './activity.sample';

export default class ActivitySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Activity);

    const newActivities1 = repository.create(course_1_activities);
    await repository.save(newActivities1);

    const newActivities2 = repository.create(course_2_activities);
    await repository.save(newActivities2);

    const newActivities3 = repository.create(course_3_activities);
    await repository.save(newActivities3);

    const newActivities4 = repository.create(course_4_activities);
    await repository.save(newActivities4);
  }
}
