import { Activity } from '../../../modules/activity/entity/activity.entity';
import { Course } from '../../../modules/course/entity/course.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  
  /* Constructor for unit tests */
  constructor(id_user: number, username: string, email: string, password: string, role: 'common' | 'admin') {
    this.id_user = id_user;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.deleted_at = null
  }

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

export { Users as User };
