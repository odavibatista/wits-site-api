import { Course } from 'src/modules/course/entity/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Activities {
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

  @Column()
  question: string;

  @Column()
  option_1: string;

  @Column()
  option_2: string;

  @Column()
  option_3: string;

  @Column()
  option_4: string;

  @Column()
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

export { Activities as Activity }