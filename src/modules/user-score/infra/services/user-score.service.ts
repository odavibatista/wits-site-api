import { Injectable } from '@nestjs/common';
import { UserScoreRepository } from '../db/repositories/user-score.repository';
import { UnprocessableDataException } from '../../../../shared/domain/errors/UnprocessableData.exception';
import { UserNotFoundException } from '../../../user/domain/dtos/errors/UserNotFound.exception';
import { FindTopScoresResponseDTO } from '../../../user/domain/dtos/requests/FindTopScores.request.dto';
import { UserRepository } from '../../../user/infra/db/repositories/user.repository';

@Injectable()
export class UserScoreService {
  constructor(
    private readonly userScoreRepository: UserScoreRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async bringTopScores(): Promise<FindTopScoresResponseDTO[] | []> {
    const top50Scores = await this.userScoreRepository.find({
      order: { total_score: 'DESC' },
      take: 50,
    });

    const ids = top50Scores.map((score) => score.user_id);

    const users = await this.userRepository.bringUsersCollection(ids);

    return top50Scores.map((score, index) => {
      return {
        id: ids[index],
        username: users.find((user) => user.id === ids[index]).username,
        score: top50Scores[index].total_score,
      };
    });
  }

  async bringIndividualScore(
    user_id: number,
  ): Promise<any | UserNotFoundException> {
    const userScore = await this.userScoreRepository.findByUserId(user_id);

    if (!userScore) throw new UserNotFoundException();

    return userScore;
  }

  async updateScore(
    user_id: number,
    score_to_add: number,
  ): Promise<void | UserNotFoundException> {
    if (
      score_to_add <= 0 ||
      !Number.isInteger(score_to_add) ||
      score_to_add.toString().length > 5
    )
      throw new UnprocessableDataException(
        'Pontuação inválida. Valor não pode ser negativo, decimal ou com mais de 5 dígitos.',
      );

    const userScoreExists = await this.userRepository.findById(user_id);

    if (!userScoreExists) throw new UserNotFoundException();

    await this.userScoreRepository.addScore(user_id, score_to_add);
  }
}
