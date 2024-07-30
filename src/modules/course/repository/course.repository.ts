import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsOrder, In, Repository } from 'typeorm';
import { Course } from '../entity/course.entity';
import { FindMultipleCoursesResponseDTO } from '../domain/requests/FindMultipleCourses.request.dto';
import { Activity } from '../../activity/entity/activity.entity';

@Injectable()
export class CourseRepository extends Repository<Course> {
  constructor(private dataSource: DataSource) {
    super(Course, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Course | null> {
    return this.findOne({ where: { id_course: id } });
  }

  async findByName(course_name: string, id?: number): Promise<Course | null> {
    return this.findOne({
      where: { course_name, id_course: id },
    });
  }

  async countById(id: number): Promise<number> {
    return this.count({ where: { id_course: id } });
  }

  async softDeleteById(id: number): Promise<true> {
    await this.softDelete({ id_course: id });
    return;
  }

  async bringCoursesCollection(
    course_ids: number[],
    order?: FindOptionsOrder<Course>,
  ): Promise<FindMultipleCoursesResponseDTO> {
    const courses = await this.find({
      where: { id_course: In(course_ids) },
      order,
    });

    return courses.map((course) => ({
      id_course: course.id_course,
      course_name: course.course_name,
      points_worth: course.points_worth,
      created_at: course.created_at,
    }));
  }
}
