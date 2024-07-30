import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Course } from '../entity/course.entity';
import { FindMultipleCoursesResponseDTO } from '../domain/requests/FindMultipleCourses.request.dto';

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

  async softDeleteById(id: string): Promise<true> {
    await this.softDelete(id);
    return
  }

  async bringCoursesCollection(
    course_ids: number[],
  ): Promise<FindMultipleCoursesResponseDTO> {
    const courses = await this.find({
      where: { id_course: In(course_ids) },
    });

    return courses.map((course) => ({
      id_course: course.id_course,
      course_name: course.course_name,
      points_worth: course.points_worth,
      created_at: course.created_at,
    }));
  }
}
