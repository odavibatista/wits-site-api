import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { UserActivityAnsweredRepository } from '../repository/user-activities-answered.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { UserNotFoundException } from '../../user/domain/errors/UserNotFound.exception';
import { WrongAnswerException } from '../domain/errors/WrongAnswer.exception';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';
import { ActivityAlreadyAnsweredException } from '../domain/errors/ActivityAlreadyAnswered.exception';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { UserScoreRepository } from '../../user-score/repository/user-score-repository';
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
        private readonly userScoreService: UserScoreService
    ) {}

    async answerQuestion(user_id: number, activity_id: number, answer: string): Promise<true | WrongAnswerException | ActivityAlreadyAnsweredException | UserNotFoundException> {
        const userExists = await this.userRepository.findOne({ where: { id_user: user_id } });

        if (!userExists) throw new UserNotFoundException();

        const activityExists = await this.activitiesRepository.findOne({ where: { id_activity: activity_id } });

        if (!activityExists) throw new ActivityNotFoundException();

        const activityHasAlreadyBeenAnswered = await this.userActivitiesAnsweredRepository.findOne({
            where: {
                activity_id,
                user_id,
            }
        })

        if (activityHasAlreadyBeenAnswered) throw new ActivityAlreadyAnsweredException();

        const isCorrect = activityExists.correct_answer === answer;

        if (!isCorrect) throw new WrongAnswerException();

        await this.userActivitiesAnsweredRepository.save({
            user_id,
            activity_id
        });

        await this.verifyCourseConclusion(user_id, activityExists.course_id);

        return true
    }

    async verifyCourseConclusion(user_id: number, course_id: number): Promise<void> {
        const activities = await this.activitiesRepository.find({ where: { course_id } });

        const answered = []

        for(const activity of activities) {
            const activityHasAlreadyBeenAnswered = await this.userActivitiesAnsweredRepository.findOne({
                where: {
                    activity_id: activity.id_activity,
                    user_id,
                }
            })

            activityHasAlreadyBeenAnswered ? answered.push(true) : answered.push(false)
        }

        if (!answered.includes(false)) {
            await this.userCourseConcludedRepository.save({
                user_id,
                course_id
            })

            const courseScore = await this.courseRepository.findOne({ where: { id_course: course_id } });

            await this.userScoreService.updateScore(user_id, courseScore.points_worth)
        }
    }
}
