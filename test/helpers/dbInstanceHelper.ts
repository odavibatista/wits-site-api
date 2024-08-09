import { DataSource } from 'typeorm';
import { appConfigurations } from '../../src/shared/config/app.config';
import { createDatabase } from "typeorm-extension";
import { dropDatabase } from 'typeorm-extension';

export class TestHelper {

    private static _instance: TestHelper;

    private constructor() {}

    public static get instance(): TestHelper {
        if(!this._instance) this._instance = new TestHelper();

        return this._instance;
    }

    private dbConnect!: DataSource;

    getRepo(entity: string) {
        return this.dbConnect.getRepository(entity);
    }

    async setupTestDB() {

      this.dbConnect = new DataSource ({
            name: appConfigurations.DB_DATABASE,
            type: appConfigurations.DB_ENGINE as any,
            host: appConfigurations.DB_HOST,
            port: appConfigurations.DB_PORT,
            username: appConfigurations.DB_USER,
            password: appConfigurations.DB_PASSWORD,
            database: process.env.DB_DATABASE.concat('_test'),
            entities: [`./**/*.entity.ts`],
            synchronize: false,
      });

      (async () => {
        await createDatabase({ifNotExist: true, options: this.dbConnect.options});
    })();

      await this.dbConnect.initialize();
    }

    teardownTestDB() {
        if (this.dbConnect.isInitialized) this.dbConnect.destroy();

        (async () => {
            await dropDatabase({ifExist: true, options: this.dbConnect.options});
        })();
    }

}
