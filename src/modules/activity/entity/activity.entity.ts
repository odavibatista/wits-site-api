import { Course } from '../../../modules/course/entity/course.entity';
import { User } from '../../../modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Activities {
  @ManyToMany(() => User, (user) => user.id_user)
  @PrimaryGeneratedColumn()
  id_activity: number;

  @ManyToOne(() => Course, (course) => course.id_course, {
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  @Column({
    nullable: false,
  })
  course_id: number;

  @Column({
    nullable: false,
    type: 'longtext'
  })
  question: string;

  @Column({
    nullable: false,
  })
  option_1: string;

  @Column({
    nullable: false,
  })
  option_2: string;

  @Column({
    nullable: false,
  })
  option_3: string;

  @Column({
    nullable: false,
  })
  option_4: string;

  @Column({
    nullable: false,
  })
  correct_answer: string;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { Activities as Activity };
