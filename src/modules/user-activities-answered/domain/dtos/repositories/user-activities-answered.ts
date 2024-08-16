import { UserActivityAnswered } from "../../../infra/db/entity/user-activities-answered.entity";

export interface UserActivitiesAnsweredRepositoryInterface {
    findAnsweredActivity(user_id: number, activity_id: number): Promise<UserActivityAnswered | null>;
}