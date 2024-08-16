import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserClearingService, UserService } from '../services/user.service';
import { JWTProvider } from '../providers/jwt.provider';
import { HashProvider } from '../providers/hash.provider';
import { UserController } from '../http/controllers/user.controller';
import { DatabaseModule } from '../../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../../activity/infra/db/entity/activity.entity';
import { Course } from '../../../course/infra/db/entity/course.entity';
import { UserCourseConcluded } from '../../../user-courses-concluded/infra/db/entity/user-courses-concluded.entity';
import { UserActivityAnswered } from '../../../user-activities-answered/infra/db/entity/user-activities-answered.entity';
import { UserScore } from '../../../user-score/infra/db/entity/user-score.entity';
import { UserRepository } from '../db/repositories/user.repository';
import { UserScoreRepository } from '../../../user-score/infra/db/repositories/user-score.repository';
import { AuthenticationMiddleware } from '../http/middlewares/auth.middleware';
import { UserCourseConcludedRepository } from '../../../user-courses-concluded/infra/db/repositories/user-courses-concluded.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Activity,
      Course,
      UserCourseConcluded,
      UserActivityAnswered,
      UserScore,
    ]),
  ],
  providers: [
    UserService,
    UserClearingService,
    UserRepository,
    UserScoreRepository,
    UserCourseConcludedRepository,
    JWTProvider,
    HashProvider,
  ],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'user/home-data', method: RequestMethod.GET },
        { path: '/user/profile', method: RequestMethod.GET },
        { path: '/user/profile', method: RequestMethod.PATCH },
      );
  }
}
