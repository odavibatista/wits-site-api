import { Activity } from '../../../modules/activity/entity/activity.entity';
import { Course } from '../../../modules/course/entity/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  COMMON = 'common',
}

@Entity()
class Users {
  @ManyToMany(() => Course, (course) => course.id_course)
  @ManyToMany(() => Activity, (activity) => activity.id_activity)
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({
    unique: true,
    length: 35,
  })
  username: string;

  @Column({
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    length: 500,
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: [Role.ADMIN, Role.COMMON],
    enumName: 'role',
  })
  role: string;

  @Column({
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

export { Users as User };
