import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ActivityService } from '../services/activity.service';
import { ActivityController } from '../http/controllers/activity.controller';
import { DatabaseModule } from '../../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../../course/infra/db/entity/course.entity';
import { User } from '../../../user/infra/db/entity/user.entity';
import { ActivityRepository } from '../db/repositories/activity.repository';
import { CourseRepository } from '../../../course/infra/db/repositories/course.repository';
import { AuthenticationMiddleware } from '../../../user/infra/http/middlewares/auth.middleware';
import { JWTProvider } from '../../../user/infra/providers/jwt.provider';

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
