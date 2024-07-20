import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserActivitiesAnsweredService } from './services/user-activities-answered.service';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Activity } from '../activity/entity/activity.entity';
import { UserActivityAnsweredRepository } from './repository/user-activities-answered.repository';
import { ActivityRepository } from '../activity/repository/activity.repository';
import { UserRepository } from '../user/repository/user.repository';
import { UserActivitiesAnsweredController } from './controller/user-activities-answered.controller';
import { AuthenticationMiddleware } from '../user/middlewares/auth.middleware';
import { JWTProvider } from '../user/providers/jwt.provider';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Activity])],
  providers: [UserActivityAnsweredRepository, UserActivitiesAnsweredService, ActivityRepository, UserRepository, JWTProvider],
  controllers: [UserActivitiesAnsweredController],
})
export class UserActivitiesAnsweredModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      {
        path: 'course/answer-activity/:activity_id',
        method: RequestMethod.POST,
      },
    );
  }
}
