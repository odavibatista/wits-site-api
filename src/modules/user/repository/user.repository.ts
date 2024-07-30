import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { MultipleUserCollectionResponseDTO } from '../domain/requests/FindUserCollection.request.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<User | null> {
    return this.findOne({ where: { id_user: id } });
  }

  async findByUsername(username: string, id?: number): Promise<User | null> {
    return this.findOne({
      where: { username, id_user: id },
    })
  }

  async findByEmail(email: string, id?: number): Promise<User | null> {
    return this.findOne({ where: { email, id_user: id } });
  }

  async softDeleteById(id: string): Promise<true> {
    await this.softDelete(id);
    return
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
