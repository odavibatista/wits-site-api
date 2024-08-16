import { User } from "../../../../user/infra/db/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class UserScores {
  /* Constructor for unit tests */
  constructor(user_id: number, total_score: number) {
    this.user_id = user_id;
    this.total_score = total_score;
    this.deleted_at = null;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

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

  @DeleteDateColumn()
  deleted_at: Date;

  @UpdateDateColumn({
    nullable: false,
  })
  updated_at: Date;
}

export { UserScores as UserScore };
