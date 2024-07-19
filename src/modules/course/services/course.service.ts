import { Injectable } from '@nestjs/common';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { CourseRepository } from '../repository/course.repository';
import {
  FindCoursesResponseDTO,
  FindIndividualCourseResponseDTO,
} from '../domain/requests/FindCourses.request.dto';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { CourseNotFoundException } from '../domain/errors/CourseNotFound.exception';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userCourseConcludedRepository: UserCourseConcludedRepository,
    private readonly activitiesRepository: ActivityRepository,
  ) {}

  async getCourses(skip: number): Promise<FindCoursesResponseDTO[]> {
    const courses = await this.courseRepository.find({
        order: { created_at: 'DESC' },
        take: 20,
        skip
    });

    const coursesWithActivities = await Promise.all(
      courses.map(async (course) => {
        const totalOfActivities = await this.activitiesRepository.count({
          where: { course_id: course.id_course },
        });

        return {
          ...course,
          total_of_activities: totalOfActivities,
        };
      }),
    );

    return coursesWithActivities;
  }

  async getCourseData(
    user_id: number,
    course_id: number,
  ): Promise<FindIndividualCourseResponseDTO | CourseNotFoundException> {
    const course = await this.courseRepository.findOne({
      where: { id_course: course_id },
    });

    if (!course) throw new CourseNotFoundException();

    const userConcluded = await this.userCourseConcludedRepository.findOne({
      where: { user_id: user_id, course_id: course_id },
    });

    const activities = (
      await this.activitiesRepository.find({ where: { course_id: course_id } })
    ).map((activity) => {
      return {
        id_activity: activity.id_activity,
        question: activity.question,
        option_1: activity.option_1,
        option_2: activity.option_2,
        option_3: activity.option_3,
        option_4: activity.option_4,
        correct_answer: activity.correct_answer,
      };
    });

    return {
      id_course: course.id_course,
      course_name: course.course_name,
      points_worth: course.points_worth,
      activities: activities,
      user_concluded_course: userConcluded ? true : false,
      created_at: course.created_at,
    };
  }
}
