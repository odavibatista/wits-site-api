import { Controller, Get, HttpException, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserScoreService } from '../services/user-score.service';
import { NotAuthenticatedException } from '../../../shared/domain/errors/NotAuthenticated.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { Request, Response } from 'express';
import { MultipleTopScoresResponseDTO } from '../../user/domain/dtos/requests/FindTopScores.request.dto';

@Controller('scores')
@ApiTags('Placar de Usuários')
export class ConjunctUserScoreController {
  constructor(private readonly userScoreService: UserScoreService) {}

  @Get('top-scores')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 200,
    description: 'Usuários top score trazidos com sucesso.',
    type: MultipleTopScoresResponseDTO,
  })
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new NotAuthenticatedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  async bringTopScores(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<MultipleTopScoresResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const result = await this.userScoreService.bringTopScores();

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }
}

@Controller('score')
@ApiTags('Placar de Usuários')
export class IndividualUserScoreController {}
