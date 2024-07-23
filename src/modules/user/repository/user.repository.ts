import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { MultipleUserCollectionResponseDTO } from '../domain/requests/FindUserCollection.request.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async bringUsersCollection(
    user_ids: number[],
  ): Promise<MultipleUserCollectionResponseDTO> {
    const users = await this.find({
      where: { id_user: In(user_ids) },
    });

    return users.map((user) => ({
      id: user.id_user,
      username: user.username,
    }));
  }
}
