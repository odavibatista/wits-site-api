import { FindOptionsOrder } from "typeorm";
import { Activity } from "../../../infra/db/entity/activity.entity";
import { FindActivitiesCollectionResponseDTO } from "../requests/FindActivitiesCollection.request.dto";

export interface ActivityRepositoryInterface {
    findById(id: number): Promise<Activity | null>;

    findByCourseId(
        course_id: number,
        order?: FindOptionsOrder<Activity>,
    ): Promise<Activity[]>;
    
    countByCourseId(course_id: number): Promise<number>;
    
    softDeleteById(id: number): Promise<true>;
    
    bringActivitiesCollection(
        activity_ids: number[],
        order?: FindOptionsOrder<Activity>,
    ): Promise<FindActivitiesCollectionResponseDTO>;
}