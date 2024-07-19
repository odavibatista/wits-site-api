import { Activity } from '../../../modules/activity/entity/activity.entity';
import { User } from '../../../modules/user/entity/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
class UserActivitiesAnswered {
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
}

export { UserActivitiesAnswered as UserActivityAnswered };
