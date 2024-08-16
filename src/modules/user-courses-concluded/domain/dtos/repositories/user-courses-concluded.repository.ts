import { UserCourseConcluded } from "../../../infra/db/entity/user-courses-concluded.entity";

export interface UserCoursesConcludedRepositoryInterface {
    findConcludedCourse(user_id: number, course_id: number): Promise<UserCourseConcluded>;

    countUserConcludedCourses(user_id: number): Promise<number>;

    countCourseGlobalConclusions(course_id: number): Promise<number>;
}