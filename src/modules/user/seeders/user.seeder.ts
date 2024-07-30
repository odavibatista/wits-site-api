import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import users from './user.sample';
import { HashProvider } from '../providers/hash.provider';

export default class UserSeeder implements Seeder {
  public async hash(source: any[]) {
    const hashProvider = new HashProvider();

    for (let i = 0; i < source.length; i++) {
      source[i].password = await hashProvider.hash(source[i].password);
    }
  }

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);

    await this.hash(users);

    const newUsers = repository.create(users);
    await repository.save(newUsers);
  }
}
