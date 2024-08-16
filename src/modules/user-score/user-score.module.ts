import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserScoreService } from './services/user-score.service';
import {
  ConjunctUserScoreController,
  IndividualUserScoreController,
} from './controller/user-score.controller';
import { User } from '../user/entity/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/infra/modules/user.module';
import { UserScoreRepository } from './repository/user-score.repository';
import { UserScore } from './entity/user-score.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { AuthenticationMiddleware } from '../user/infra/http/middlewares/auth.middleware';
import { JWTProvider } from '../user/providers/jwt.provider';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TypeOrmModule.forFeature([User, UserScore]),
  ],
  providers: [
    UserScoreService,
    UserScoreRepository,
    UserRepository,
    JWTProvider,
  ],
  controllers: [ConjunctUserScoreController, IndividualUserScoreController],
})
export class UserScoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes({ path: 'scores/top-scores', method: RequestMethod.GET });
  }
}
