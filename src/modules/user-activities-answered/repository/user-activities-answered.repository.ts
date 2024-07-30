import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserActivityAnswered } from '../entity/user-activities-answered.entity';

@Injectable()
export class UserActivityAnsweredRepository extends Repository<UserActivityAnswered> {
  constructor(private dataSource: DataSource) {
    super(UserActivityAnswered, dataSource.createEntityManager());
  }

  async findAnsweredActivity(user_id:number, activity_id: number): Promise<UserActivityAnswered | null> {
    return this.findOne({ where: { user_id, activity_id } });
  }
}
