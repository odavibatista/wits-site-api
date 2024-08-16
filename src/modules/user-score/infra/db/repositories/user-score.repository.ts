import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserScore } from '../entity/user-score.entity';
import { UserScoreRepositoryInterface } from '../../../domain/dtos/repositories/user-score.repository';

@Injectable()
export class UserScoreRepository extends Repository<UserScore> implements UserScoreRepositoryInterface {
  constructor(private dataSource: DataSource) {
    super(UserScore, dataSource.createEntityManager());
  }

  async findByUserId(user_id: number): Promise<UserScore | null> {
    return this.findOne({ where: { user_id } });
  }

  async addScore(user_id: number, score_to_add: number): Promise<void> {
    const userScore = await this.findByUserId(user_id);

    userScore.total_score += score_to_add;

    await this.save(userScore);
  }
}
