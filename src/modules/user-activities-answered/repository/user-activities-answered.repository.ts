import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserActivityAnswered } from '../entity/user-activities-answered.entity';

@Injectable()
export class UserActivityAnsweredRepository extends Repository<UserActivityAnswered> {
  constructor(private dataSource: DataSource) {
    super(UserActivityAnswered, dataSource.createEntityManager());
  }
}
