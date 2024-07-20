import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';
import CourseSeeder from './course/seeders/course.seeder';
import ActivitySeeder from './activity/seeders/activity.seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Seeders will go here
    await runSeeder(dataSource, CourseSeeder);

    await runSeeder(dataSource, ActivitySeeder);
  }
}
