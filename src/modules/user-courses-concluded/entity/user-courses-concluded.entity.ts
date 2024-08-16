import { Course } from '../../course/infra/db/entity/course.entity';
import { User } from '../../../modules/user/entity/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class UserCoursesConcluded {
  /* Constructor for unit tests */
  constructor(user_id: number, course_id: number) {
    this.user_id = user_id;
    this.course_id = course_id;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.deleted_at = null;
  }

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

  @DeleteDateColumn({
    nullable: true,
  })
  deleted_at: string;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { UserCoursesConcluded as UserCourseConcluded };
