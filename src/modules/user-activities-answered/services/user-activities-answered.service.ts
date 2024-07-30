import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { UserActivityAnsweredRepository } from '../repository/user-activities-answered.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';
import { WrongAnswerException } from '../domain/errors/WrongAnswer.exception';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';
import { ActivityAlreadyAnsweredException } from '../domain/errors/ActivityAlreadyAnswered.exception';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { UserScoreService } from '../../user-score/services/user-score.service';
import { CourseRepository } from '../../course/repository/course.repository';

@Injectable()
export class UserActivitiesAnsweredService {
  constructor(
    private readonly userActivitiesAnsweredRepository: UserActivityAnsweredRepository,
    private readonly activitiesRepository: ActivityRepository,
    private readonly userRepository: UserRepository,
    private readonly userCourseConcludedRepository: UserCourseConcludedRepository,
    private readonly courseRepository: CourseRepository,
    private readonly userScoreService: UserScoreService,
  ) {}

  async answerQuestion(
    user_id: number,
    activity_id: number,
    answer: string,
  ): Promise<
    | true
    | WrongAnswerException
    | ActivityAlreadyAnsweredException
    | UserNotFoundException
  > {
    const userExists = await this.userRepository.findById(user_id);

    if (!userExists) throw new UserNotFoundException();

    const activityExists = await this.activitiesRepository.findById(activity_id);

    if (!activityExists) throw new ActivityNotFoundException();

    const activityHasAlreadyBeenAnswered =
      await this.userActivitiesAnsweredRepository.findAnsweredActivity(user_id, activity_id);

    if (activityHasAlreadyBeenAnswered)
      throw new ActivityAlreadyAnsweredException();

    if (activityExists.correct_answer !== answer) throw new WrongAnswerException();

    await this.userActivitiesAnsweredRepository.save({
      user_id,
      activity_id,
    });

    await this.verifyCourseConclusion(user_id, activityExists.course_id);

    return true;
  }

  /* This method will see if the user has already finished all the activities from a course. If he did, the course will be marked as completed for the user and their score will be increased by the points the course gives. */
  async verifyCourseConclusion(
    user_id: number,
    course_id: number,
  ): Promise<void> {
    const activities = await this.activitiesRepository.findByCourseId(course_id);

    const answered = [];

    for (const activity of activities) {
      const activityHasAlreadyBeenAnswered =
        await this.userActivitiesAnsweredRepository.findAnsweredActivity(user_id, activity.id_activity);

      activityHasAlreadyBeenAnswered
        ? answered.push(true)
        : answered.push(false);
    }

    if (!answered.includes(false)) {
      await this.userCourseConcludedRepository.save({
        user_id,
        course_id,
      });

      const courseScore = await this.courseRepository.findById(course_id);

      await this.userScoreService.updateScore(
        user_id,
        courseScore.points_worth,
      );
    }
  }
}
