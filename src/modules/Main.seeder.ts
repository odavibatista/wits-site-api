import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';
import CourseSeeder from './course/infra/db/seeders/course.seeder';
import ActivitySeeder from './activity/infra/db/seeders/activity.seeder';
import UserSeeder from './user/infra/db/seeders/user.seeder';
import UserScoreSeeder from './user-score/infra/db/seeders/user-score.seeder';

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
