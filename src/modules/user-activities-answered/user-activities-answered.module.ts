import { Module } from '@nestjs/common';
import { UserActivitiesAnsweredService } from './services/user-activities-answered.service';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Activity } from '../activity/entity/activity.entity';
import { UserActivityAnsweredRepository } from './repository/user-activities-answered.repository';
import { ActivityRepository } from '../activity/repository/activity.repository';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Activity])],
  providers: [UserActivityAnsweredRepository, UserActivitiesAnsweredService, ActivityRepository, UserRepository],
})
export class UserActivitiesAnsweredModule {}
