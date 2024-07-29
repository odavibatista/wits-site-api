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

  async findById(id: number): Promise<User | null> {
    return this.findOne({ where: { id_user: id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async userNameIsInUse(username: string): Promise<boolean> {
    const user = await this.findOne({ where: { username } });

    return !!user;
  }

  async emailIsInUse(email: string): Promise<boolean> {
    const user = await this.findOne({ where: { email } });

    return !!user;
  }
}
