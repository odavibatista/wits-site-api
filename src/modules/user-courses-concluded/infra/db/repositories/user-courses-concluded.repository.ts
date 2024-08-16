import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCourseConcluded } from '../entity/user-courses-concluded.entity';
import { UserCoursesConcludedRepositoryInterface } from '../../../domain/dtos/repositories/user-courses-concluded.repository';

@Injectable()
export class UserCourseConcludedRepository extends Repository<UserCourseConcluded> implements UserCoursesConcludedRepositoryInterface {
  constructor(private dataSource: DataSource) {
    super(UserCourseConcluded, dataSource.createEntityManager());
  }

  async findConcludedCourse(
    user_id: number,
    course_id: number,
  ): Promise<UserCourseConcluded> {
    return this.findOne({
      where: { user_id, course_id },
    });
  }

  async countUserConcludedCourses(user_id: number): Promise<number> {
    return this.count({ where: { user_id } });
  }

  async countCourseGlobalConclusions(course_id: number): Promise<number> {
    return this.count({ where: { course_id } });
  }
}
