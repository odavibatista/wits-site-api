import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';
import CourseSeeder from './course/seeders/course.seeder';
import ActivitySeeder from './activity/seeders/activity.seeder';
import UserSeeder from './user/infra/db/seeders/user.seeder';
import UserScoreSeeder from './user-score/seeders/user-score.seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Seeders will go here
    await runSeeder(dataSource, CourseSeeder);

    await runSeeder(dataSource, ActivitySeeder);

    await runSeeder(dataSource, UserSeeder);

    await runSeeder(dataSource, UserScoreSeeder);
  }
}
