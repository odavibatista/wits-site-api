import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {
  ConjunctCoursesController,
  IndividualCoursesController,
} from '../http/controllers/course.controller';
import { CourseService } from '../services/course.service';
import { DatabaseModule } from '../../../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../../activity/infra/db/entity/activity.entity';
import { User } from '../../../user/infra/db/entity/user.entity';
import { UserCourseConcludedRepository } from '../../../user-courses-concluded/repository/user-courses-concluded.repository';
import { CourseRepository } from '../db/repositories/course.repository';
import { ActivityRepository } from '../../../activity/infra/db/repositories/activity.repository';
import { AuthenticationMiddleware } from '../../../user/infra/http/middlewares/auth.middleware';
import { UserCourseConcluded } from '../../../user-courses-concluded/entity/user-courses-concluded.entity';
import { JWTProvider } from '../../../user/infra/providers/jwt.provider';
import { UserActivityAnsweredRepository } from '../../../user-activities-answered/repositories/user-activities-answered.repository';
import { UserRepository } from '../../../user/infra/db/repositories/user.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Activity, UserCourseConcluded, User]),
  ],
  controllers: [ConjunctCoursesController, IndividualCoursesController],
  providers: [
    CourseService,
    CourseRepository,
    UserCourseConcludedRepository,
    ActivityRepository,
    UserActivityAnsweredRepository,
    JWTProvider,
    UserRepository,
  ],
})
export class CourseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      {
        path: 'courses/browse',
        method: RequestMethod.GET,
      },
      {
        path: 'course/:course_id/info',
        method: RequestMethod.GET,
      },
      {
        path: 'course/create',
        method: RequestMethod.POST,
      },
      {
        path: 'course/edit/:course_id',
        method: RequestMethod.PATCH,
      },
      {
        path: 'course/remove/:course_id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
