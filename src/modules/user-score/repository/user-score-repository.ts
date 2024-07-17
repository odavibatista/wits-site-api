import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserScore } from '../entity/user-score.entity';

@Injectable()
export class UserScoreRepository extends Repository<UserScore>    {
    constructor(private dataSource: DataSource)
    {
        super(UserScore, dataSource.createEntityManager());
    }
}