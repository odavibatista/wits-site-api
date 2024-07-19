import { Module } from '@nestjs/common';
import { UserActivitiesAnsweredService } from './services/user-activities-answered.service';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Activity } from '../activity/entity/activity.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Activity])],
  providers: [UserActivitiesAnsweredService],
})
export class UserActivitiesAnsweredModule {}
