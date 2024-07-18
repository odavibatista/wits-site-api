import { User } from '../../../modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class UserScores {
  @PrimaryColumn({
    unique: true,
  })
  @OneToOne(() => User, (user) => user.id_user, {
    nullable: false,
  })
  user_id: number;

  @Column()
  total_score: number;

  @CreateDateColumn({
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { UserScores as UserScore };
