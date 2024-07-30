import { Course } from '../../../modules/course/entity/course.entity';
import { User } from '../../../modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Activities {

  /* Constructor for unit tests */
  constructor(id_activity: number, course_id: number, question: string, option_1: string, option_2: string, option_3: string, option_4: string, correct_answer: string) {
    this.id_activity = id_activity;
    this.course_id = course_id;
    this.question = question;
    this.option_1 = option_1;
    this.option_2 = option_2;
    this.option_3 = option_3;
    this.option_4 = option_4;
    this.correct_answer = correct_answer;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.deleted_at = null
  }

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
    type: process.env.DB_ENGINE === 'mysql' ? 'longtext' : 'text',
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

  @DeleteDateColumn()
  deleted_at: Date;

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
