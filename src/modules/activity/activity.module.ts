import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ActivityService } from './services/activity.service';
import { ActivityController } from './controller/activity.controller';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entity/course.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Course])],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
