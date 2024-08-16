import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserActivitiesAnsweredService } from '../infra/services/user-activities-answered.service';
import { Request, Response } from 'express';
import {
  AnswerQuestionRequestDTO,
  AnswerQuestionResponseDTO,
} from '../domain/dtos/requests/AnswerQuestion.request.dto';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { NotAuthenticatedException } from '../../../shared/domain/errors/NotAuthenticated.exception';
import { WrongAnswerException } from '../domain/dtos/errors/WrongAnswer.exception';
import { CommonException } from '../../../shared/domain/errors/Common.exception';

@Controller('course')
@ApiTags('Atividades do Curso')
export class UserActivitiesAnsweredController {
  constructor(
    private readonly userActivitiesAnsweredService: UserActivitiesAnsweredService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Resposta certa!',
    type: AnswerQuestionResponseDTO,
  })
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnauthorizedException().getStatus(),
    description: new UnauthorizedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new WrongAnswerException().getStatus(),
    description: new WrongAnswerException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  @Post('answer-activity/:activity_id')
  @ApiBearerAuth('user-token')
  async answerActivity(
    @Param('activity_id') activityId: number,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AnswerQuestionRequestDTO,
  ): Promise<AnswerQuestionResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      throw new NotAuthenticatedException();
    }

    if (user.role === 'admin') {
      throw new UnauthorizedException();
    }

    const result = await this.userActivitiesAnsweredService.answerQuestion(
      user.id,
      activityId,
      body.answer,
    );

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json({
        success: true,
      });
    }
  }
}
