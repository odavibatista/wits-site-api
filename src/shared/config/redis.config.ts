import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";
import { appConfigurations } from "./app.config";

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async () => {
      const store = await redisStore({
        ttl: 60 * 10000,
        socket: {
          host: appConfigurations.REDIS_HOST,
          port: appConfigurations.REDIS_PORT,
        },
      });
      return {
        store: () => store,
      };
    },
    inject: [],
  };