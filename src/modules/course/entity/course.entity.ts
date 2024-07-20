import { User } from '../../../modules/user/entity/user.entity';
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
