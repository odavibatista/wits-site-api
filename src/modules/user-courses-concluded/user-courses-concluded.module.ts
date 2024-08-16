import { Module } from '@nestjs/common';
import { UserCoursesConcludedDtoService } from './services/user-courses-concluded.dto.service';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Course } from '../course/infra/db/entity/course.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Course])],
  providers: [UserCoursesConcludedDtoService],
})
export class UserCoursesConcludedModule {}
