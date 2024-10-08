import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserActivitiesAnsweredService } from '../services/user-activities-answered.service';
import { DatabaseModule } from '../../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user/infra/db/entity/user.entity';
import { Activity } from '../../../activity/infra/db/entity/activity.entity';
import { UserActivityAnsweredRepository } from '../db/repositories/user-activities-answered.repository';
import { ActivityRepository } from '../../../activity/infra/db/repositories/activity.repository';
import { UserRepository } from '../../../user/infra/db/repositories/user.repository';
import { UserActivitiesAnsweredController } from '../http/controllers/user-activities-answered.controller';
import { AuthenticationMiddleware } from '../../../user/infra/http/middlewares/auth.middleware';
import { JWTProvider } from '../../../user/infra/providers/jwt.provider';
import { UserCourseConcludedRepository } from '../../../user-courses-concluded/infra/db/repositories/user-courses-concluded.repository';
import { UserScoreRepository } from '../../../user-score/infra/db/repositories/user-score.repository';
import { UserScoreService } from '../../../user-score/infra/services/user-score.service';
import { CourseRepository } from '../../../course/infra/db/repositories/course.repository';
import { UserService } from '../../../user/infra/services/user.service';
import { HashProvider } from '../../../user/infra/providers/hash.provider';
import { UserScore } from '../../../user-score/infra/db/entity/user-score.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Activity, UserScore]),
  ],
  providers: [
    UserActivityAnsweredRepository,
    UserActivitiesAnsweredService,
    ActivityRepository,
    UserRepository,
    JWTProvider,
    UserCourseConcludedRepository,
    UserScoreService,
    CourseRepository,
    UserScoreRepository,
    UserService,
    HashProvider,
  ],
  controllers: [UserActivitiesAnsweredController],
})
export class UserActivitiesAnsweredModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({
      path: 'course/answer-activity/:activity_id',
      method: RequestMethod.POST,
    });
  }
}
