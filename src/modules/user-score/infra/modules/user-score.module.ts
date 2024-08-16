import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserScoreService } from '../services/user-score.service';
import {
  ConjunctUserScoreController,
  IndividualUserScoreController,
} from '../http/controllers/user-score.controller';
import { User } from '../../../user/infra/db/entity/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../../../user/infra/modules/user.module';
import { UserScoreRepository } from '../db/repositories/user-score.repository';
import { UserScore } from '../db/entity/user-score.entity';
import { UserRepository } from '../../../user/infra/db/repositories/user.repository';
import { AuthenticationMiddleware } from '../../../user/infra/http/middlewares/auth.middleware';
import { JWTProvider } from '../../../user/infra/providers/jwt.provider';

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
