import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCourseConcluded } from '../entity/user-courses-concluded.entity';

@Injectable()
export class UserCourseConcludedRepository extends Repository<UserCourseConcluded> {
  constructor(private dataSource: DataSource) {
    super(UserCourseConcluded, dataSource.createEntityManager());
  }
}
