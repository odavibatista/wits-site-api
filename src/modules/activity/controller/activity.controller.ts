import { Body, Controller, Delete, HttpException, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { ActivityService } from '../services/activity.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateActivityRequestDTO, CreateActivityResponseDTO } from '../domain/requests/CreateActivity.request.dto';
import { NotAuthenticatedException } from '../../../shared/domain/errors/NotAuthenticated.exception';
import { CourseNotFoundException } from '../../course/domain/errors/CourseNotFound.exception';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { Request, Response } from 'express';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { NoPermisionException } from '../../../shared/domain/errors/NoPermission.exception';
import { EditActivityResponseDTO } from '../domain/requests/EditActivity.request.dto';
import { ActivityNotFoundException } from '../domain/errors/ActivityNotFound.exception';

@Controller('activity')
@ApiTags('Atividades do Curso')
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService,
    ) {}

    @Post('create')
    @ApiBearerAuth('user-token')
    @ApiResponse({
        status: 201,
        description: 'Atividade criada com sucesso.',
        type: CreateActivityResponseDTO,
      })
      @ApiResponse({
        status: new NotAuthenticatedException().getStatus(),
        description: new NotAuthenticatedException().message,
        type: AllExceptionsFilterDTO,
      })
      @ApiResponse({
        status: new CourseNotFoundException().getStatus(),
        description: new CourseNotFoundException().message,
        type: AllExceptionsFilterDTO,
      })
      @ApiResponse({
        status: new CommonException().getStatus(),
        description: new CommonException().message,
        type: AllExceptionsFilterDTO,
      })
      async createActivity(
        @Body() createActivityRequestDTO: CreateActivityRequestDTO,
        @Req() req: Request,
        @Res() res: Response,
      ): Promise<CreateActivityResponseDTO | AllExceptionsFilterDTO> {
        const user = req.user;
    
        if (!user || user.role !== 'admin')
            return res.status(new NoPermisionException().getStatus()).json({
              message: new NoPermisionException().message,
              status: new NoPermisionException().getStatus(),
            });
    
        const result = await this.activityService.createActivity(createActivityRequestDTO);

        if (result instanceof HttpException) {
            return res.status(result.getStatus()).json({
              message: result.message,
              status: result.getStatus(),
            });
          } else {
            return res.status(201).json(result);
          }
      }

    @Patch('edit/:id')
    @ApiBearerAuth('user-token')
    @ApiResponse({
      status: 201,
      description: 'Atividade editada com sucesso.',
      type: EditActivityResponseDTO,
    })
    @ApiResponse({
      status: new NotAuthenticatedException().getStatus(),
      description: new NotAuthenticatedException().message,
      type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
      status: new NoPermisionException().getStatus(),
      description: new NoPermisionException().message,
      type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
      status: new ActivityNotFoundException().getStatus(),
      description: new ActivityNotFoundException().message,
      type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
      status: new CommonException().getStatus(),
      description: new CommonException().message,
      type: AllExceptionsFilterDTO,
    })
    async editActivity(
      @Body() editActivityRequestDTO: EditActivityResponseDTO,
      @Param('id') id: number,
      @Req() req: Request,
      @Res() res: Response,
    ): Promise<EditActivityResponseDTO | AllExceptionsFilterDTO> {
      const user = req.user;

      if (!user || user.role !== 'admin')
        return res.status(new NoPermisionException().getStatus()).json({
          message: new NoPermisionException().message,
          status: new NoPermisionException().getStatus(),
        });

      const result = await this.activityService.editActivity(id, editActivityRequestDTO);

      if (result instanceof HttpException) {
        return res.status(result.getStatus()).json({
          message: result.message,
          status: result.getStatus(),
        });
      } else {
        return res.status(201).json(result);
      }
    }

    @Delete('remove/:id')
    @ApiBearerAuth('user-token')
    @ApiResponse({
      status: 204,
      description: 'Atividade removida com sucesso.',
    })
    @ApiResponse({
      status: new NotAuthenticatedException().getStatus(),
      description: new NotAuthenticatedException().message,
      type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
      status: new NoPermisionException().getStatus(),
      description: new NoPermisionException().message,
      type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
      status: new ActivityNotFoundException().getStatus(),
      description: new ActivityNotFoundException().message,
      type: AllExceptionsFilterDTO,
    })
    @ApiResponse({
      status: new CommonException().getStatus(),
      description: new CommonException().message,
      type: AllExceptionsFilterDTO,
    })
    async removeActivity(
      @Param('id') id: number,
      @Req() req: Request,
      @Res() res: Response,
    ): Promise<void | AllExceptionsFilterDTO> {
      const user = req.user;

      if (!user || user.role !== 'admin')
        return res.status(new NoPermisionException().getStatus()).json({
          message: new NoPermisionException().message,
          status: new NoPermisionException().getStatus(),
        });

      const result = await this.activityService.removeActivity(id);

      if (result instanceof HttpException) {
        return res.status(result.getStatus()).json({
          message: result.message,
          status: result.getStatus(),
        });
      } else {
        return res.status(204).json();
      }
    }
}
