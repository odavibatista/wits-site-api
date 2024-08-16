import { UserScore } from "../../../infra/db/entity/user-score.entity";

export interface UserScoreRepositoryInterface {
    findByUserId(user_id: number): Promise<UserScore | null>;

    addScore(user_id: number, score_to_add: number): Promise<void>;
}