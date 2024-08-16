import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserScore } from '../entity/user-score.entity';
import userScores from './user-score.sample';

export default class UserScoreSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserScore);

    const newUserScores = repository.create(userScores);
    await repository.save(newUserScores);
  }
}
