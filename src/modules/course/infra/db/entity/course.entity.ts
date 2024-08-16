import { User } from "../../../../user/infra/db/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Courses {
  /* Constructor for unit tests */
  constructor(id_course: number, course_name: string, points_worth: number) {
    this.id_course = id_course;
    this.course_name = course_name;
    this.points_worth = points_worth;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.deleted_at = null;
  }

  @ManyToMany(() => User, (user) => user.id_user)
  @PrimaryGeneratedColumn()
  id_course: number;

  @Column()
  course_name: string;

  @Column()
  points_worth: number;

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

export { Courses as Course };
