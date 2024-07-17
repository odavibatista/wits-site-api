import { Module } from '@nestjs/common';
import { UserScoreService } from './services/user-score.service';
import { UserScoreController } from './controller/user-score.controller';
import { User } from '../user/entity/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserScoreService],
  controllers: [UserScoreController],
})
export class UserScoreModule {}
