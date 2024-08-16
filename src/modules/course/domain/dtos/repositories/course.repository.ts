import { FindOptionsOrder } from "typeorm";
import { Course } from "../../../infra/db/entity/course.entity";
import { FindMultipleCoursesResponseDTO } from "../requests/FindMultipleCourses.request.dto";

export interface CourseRepositoryInterface {
    findById(id: number): Promise<Course | null>;
    
    findByName(course_name: string, id?: number): Promise<Course | null>;
    
    countById(id: number): Promise<number>;
    
    softDeleteById(id: number): Promise<true>;
    
    bringCoursesCollection(
        course_ids: number[],
        order?: FindOptionsOrder<Course>,
    ): Promise<FindMultipleCoursesResponseDTO>;
}