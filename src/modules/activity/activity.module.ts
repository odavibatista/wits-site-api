import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ActivityService } from './services/activity.service';
import { ActivityController } from './controller/activity.controller';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entity/course.entity';
import { User } from '../user/entity/user.entity';
import { ActivityRepository } from './repository/activity.repository';
import { CourseRepository } from '../course/repository/course.repository';
import { AuthenticationMiddleware } from '../user/middlewares/auth.middleware';
import { JWTProvider } from '../user/providers/jwt.provider';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Course])],
  providers: [
    ActivityService,
    ActivityRepository,
    CourseRepository,
    JWTProvider,
  ],
  controllers: [ActivityController],
})
export class ActivityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      {
        path: 'activity/create',
        method: RequestMethod.POST,
      },

      {
        path: 'activity/edit/:id',
        method: RequestMethod.PATCH,
      },

      {
        path: 'activity/remove/:id',
        method: RequestMethod.DELETE,
      },
      {
        path: '/activity/:activity_id/info',
        method: RequestMethod.GET,
      },
    );
  }
}
