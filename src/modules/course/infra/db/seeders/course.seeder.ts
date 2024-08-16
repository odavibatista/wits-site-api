import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Course } from '../entity/course.entity';
import courses from './course.sample';

export default class CourseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Course);

    const newCourses = repository.create(courses);
    await repository.save(newCourses);
  }
}
