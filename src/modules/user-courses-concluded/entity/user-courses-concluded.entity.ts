import { Course } from '../../../modules/course/entity/course.entity';
import { User } from '../../../modules/user/entity/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
class UserCoursesConcluded {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  course_id: number;

  @ManyToOne(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.id_course)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}

export { UserCoursesConcluded as UserCourseConcluded };
