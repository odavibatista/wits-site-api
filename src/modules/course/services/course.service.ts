import { Injectable } from '@nestjs/common';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { CourseRepository } from '../repository/course.repository';
import {
  FindCoursesResponseDTO,
  FindIndividualCourseResponseDTO,
} from '../domain/requests/FindCourses.request.dto';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { CourseNotFoundException } from '../domain/errors/CourseNotFound.exception';
import { UserActivityAnsweredRepository } from '../../user-activities-answered/repository/user-activities-answered.repository';
import {
  CreateCourseRequestDTO,
  CreateCourseResponseDTO,
} from '../domain/requests/CreateCourse.request.dto';
import { nameValidate } from '../../../shared/utils/username.validator';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import {
  EditCourseRequestDTO,
  EditCourseResponseDTO,
} from '../domain/requests/EditCourse.request.dto';
import { UserRepository } from '../../user/repository/user.repository';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userCourseConcludedRepository: UserCourseConcludedRepository,
    private readonly activitiesRepository: ActivityRepository,
    private readonly userRepository: UserRepository,
    private readonly userActivityAnsweredRepository: UserActivityAnsweredRepository,
  ) {}

  async getCourses(skip: number): Promise<FindCoursesResponseDTO[]> {
    const courses = await this.courseRepository.find({
      order: { created_at: 'DESC' },
      take: 20,
      skip,
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
  ): Promise<
    | FindIndividualCourseResponseDTO
    | UserNotFoundException
    | CourseNotFoundException
  > {
    const user = await this.userRepository.findOne({
      where: { id_user: user_id },
    });

    if (!user) throw new UserNotFoundException();

    const course = await this.courseRepository.findOne({
      where: { id_course: course_id },
    });

    if (!course) throw new CourseNotFoundException();

    const userConcluded = await this.userCourseConcludedRepository.findOne({
      where: { user_id: user_id, course_id: course_id },
    });

    const activities = (
      await this.activitiesRepository.find({ where: { course_id: course_id } })
    ).map(async (activity) => {
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
      activities: await Promise.all(activities),
      user_concluded_course: userConcluded ? true : false,
      concluded_at: userConcluded ? userConcluded.created_at : null,
      created_at: course.created_at,
    };
  }

  async createCourse(
    courseData: CreateCourseRequestDTO,
  ): Promise<CreateCourseResponseDTO | UnprocessableDataException> {
    if (
      !nameValidate(courseData.course_name) ||
      courseData.course_name.length < 5 ||
      courseData.course_name.length > 25
    )
      throw new UnprocessableDataException('Nome do curso inválido');

    if (
      !Number.isInteger(courseData.points_worth) ||
      courseData.points_worth <= 0 ||
      courseData.points_worth.toString().length > 5
    )
      throw new UnprocessableDataException(
        'Total de pontos deve ser um número inteiro positivo maior que 0 e não pode conter mais de 5 casas numéricas.',
      );

    const course = await this.courseRepository.save({
      course_name: courseData.course_name,
      points_worth: courseData.points_worth,
    });

    return {
      id_course: course.id_course,
      course_name: course.course_name,
      points_worth: course.points_worth,
      created_at: course.created_at,
    };
  }

  async editCourse(
    id: number,
    courseData: EditCourseRequestDTO,
  ): Promise<
    EditCourseResponseDTO | CourseNotFoundException | UnprocessableDataException
  > {
    if (!nameValidate(courseData.course_name))
      throw new UnprocessableDataException('Nome do curso inválido');

    if (
      !Number.isInteger(courseData.points_worth) ||
      courseData.points_worth <= 0 ||
      courseData.points_worth.toString().length > 5
    )
      throw new UnprocessableDataException(
        'Total de pontos deve ser um número inteiro positivo maior que 0 e não pode conter mais de 5 casas numéricas.',
      );

    const course = await this.courseRepository.findOne({
      where: { id_course: id },
    });

    if (!course) throw new CourseNotFoundException();

    course.course_name = courseData.course_name;
    course.points_worth = courseData.points_worth;

    await this.courseRepository.update(
      { id_course: id },
      {
        course_name: course.course_name,
        points_worth: course.points_worth,
      },
    );

    return {
      id_course: course.id_course,
      course_name: course.course_name,
      points_worth: course.points_worth,
      created_at: course.created_at,
    };
  }

  async removeCourse(id: number): Promise<void | CourseNotFoundException> {
    const course = await this.courseRepository.findOne({
      where: { id_course: id },
    });

    if (!course) throw new CourseNotFoundException();

    await this.courseRepository.softDelete({ id_course: id });

    await this.activitiesRepository.softDelete({ course_id: id });
  }
}
