import { Activity } from '../../../modules/activity/entity/activity.entity';
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
class UserActivitiesAnswered {
  /* Constructor for unit tests */
  constructor(user_id: number, activity_id: number) {
    this.user_id = user_id;
    this.activity_id = activity_id;
    this.deleted_at = null;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  activity_id: number;

  @ManyToOne(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.id_activity)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

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

export { UserActivitiesAnswered as UserActivityAnswered };
