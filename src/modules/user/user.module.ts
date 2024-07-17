import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserClearingService, UserService } from './services/user.service';
import { JWTProvider } from './providers/jwt.provider';
import { HashProvider } from './providers/hash.provider';
import { UserController } from './controller/user.controller';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activity/entity/activity.entity';
import { Course } from '../course/entity/course.entity';
import { UserCourseConcluded } from '../user-courses-concluded/entity/user-courses-concluded.entity';
import { UserActivityAnswered } from '../user-activities-answered/entity/user-activities-answered.entity';
import { UserScore } from '../user-score/entity/user-score.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Activity,
      Course,
      UserCourseConcluded,
      UserActivityAnswered,
      UserScore
    ]),
  ],
  providers: [UserService, UserClearingService, JWTProvider, HashProvider],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}