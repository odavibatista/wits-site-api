import { FindOptionsOrder } from "typeorm";
import { User } from "../../../infra/db/entity/user.entity";
import { MultipleUserCollectionResponseDTO } from "../requests/FindUserCollection.request.dto";

export interface UserRepositoryInterface    {
    findById(id: number): Promise<User | null>;

    findByUsername(username: string, id?: number): Promise<User | null>;

    findByEmail(email: string, id?: number): Promise<User | null>;

    softDeleteById(id: number): Promise<true>;

    bringUsersCollection(user_ids: number[], order?: FindOptionsOrder<User>): Promise<MultipleUserCollectionResponseDTO>;
}