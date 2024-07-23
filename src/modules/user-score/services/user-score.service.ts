import { Injectable } from '@nestjs/common';
import { UserScoreRepository } from '../repository/user-score-repository';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';

@Injectable()
export class UserScoreService {
  constructor(private readonly userScoreRepository: UserScoreRepository) {}

  async bringIndividualScore(user_id: number): Promise<any | UserNotFoundException> {
    const userScore = await this.userScoreRepository.findOne({
      where: { user_id: user_id },
    });

    if (!userScore) throw new UserNotFoundException();

    return userScore;
  }

  async updateScore(user_id: number, score_to_add: number): Promise<void> {
    if (score_to_add < 0)
      throw new UnprocessableDataException(
        'Pontuação inválida. Número negativo.',
      );

    const userScore = await this.userScoreRepository.findOne({
      where: { user_id: user_id },
    });

    userScore.total_score += score_to_add;

    await this.userScoreRepository.save(userScore);
  }
}
