import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CourseService } from '../services/course.service';
import {
  FindCoursesResponseDTO,
  FindIndividualCourseResponseDTO,
} from '../domain/requests/FindCourses.request.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotAuthenticatedException } from '../../../shared/domain/errors/NotAuthenticated.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { Request, Response } from 'express';
import { CourseNotFoundException } from '../domain/errors/CourseNotFound.exception';
import { PaginationDto } from '../../../shared/domain/dtos/providers/Pagination.dto';
import {
  CreateCourseRequestDTO,
  CreateCourseResponseDTO,
} from '../domain/requests/CreateCourse.request.dto';
import { NoPermisionException } from '../../../shared/domain/errors/NoPermission.exception';
import {
  EditCourseRequestDTO,
  EditCourseResponseDTO,
} from '../domain/requests/EditCourse.request.dto';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';

@Controller('courses')
@ApiTags('Cursos')
export class ConjunctCoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get('browse')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 200,
    description: 'Cursos trazidos com sucesso.',
    type: FindCoursesResponseDTO,
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
  async browse(
    @Req() req: Request,
    @Res() res: Response,
    @Query() paginationDto: PaginationDto,
  ): Promise<FindCoursesResponseDTO[] | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const { page } = paginationDto;

    const result = await this.courseService.getCourses((page - 1) * 20);

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

@Controller('course')
@ApiTags('Cursos')
export class IndividualCoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get(':course_id/info')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 200,
    description: 'Dados do curso trazidos com sucesso.',
    type: FindIndividualCourseResponseDTO,
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
  async findCourse(
    @Param('course_id') courseId: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<FindIndividualCourseResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const result = await this.courseService.getCourseData(user.id, courseId);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }

  @Post('/create')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 201,
    description: 'Curso criado com sucesso.',
    type: CreateCourseResponseDTO,
  })
  @ApiResponse({
    status: new NoPermisionException().getStatus(),
    description: new NoPermisionException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnprocessableDataException().getStatus(),
    description: new UnprocessableDataException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  async createCourse(
    @Req() req: Request,
    @Res() res: Response,
    @Body() courseData: CreateCourseRequestDTO,
  ): Promise<CreateCourseResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user || user.role !== 'admin')
      return res.status(new NoPermisionException().getStatus()).json({
        message: new NoPermisionException().message,
        status: new NoPermisionException().getStatus(),
      });

    const result = await this.courseService.createCourse(courseData);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(201).json(result);
    }
  }

  @Patch('/edit/:course_id')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 201,
    description: 'Curso editado com sucesso.',
    type: EditCourseResponseDTO,
  })
  @ApiResponse({
    status: new NoPermisionException().getStatus(),
    description: new NoPermisionException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CourseNotFoundException().getStatus(),
    description: new CourseNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UnprocessableDataException().getStatus(),
    description: new UnprocessableDataException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  async editCourse(
    @Req() req: Request,
    @Res() res: Response,
    @Param('course_id') courseId: number,
    @Body() courseData: EditCourseRequestDTO,
  ): Promise<EditCourseResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user || user.role !== 'admin')
      return res.status(new NoPermisionException().getStatus()).json({
        message: new NoPermisionException().message,
        status: new NoPermisionException().getStatus(),
      });

    const result = await this.courseService.editCourse(courseId, courseData);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(201).json(result);
    }
  }

  @Delete('remove/:course_id')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: 204,
    description: 'Curso removido com sucesso.',
  })
  @ApiResponse({
    status: new NoPermisionException().getStatus(),
    description: new NoPermisionException().message,
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
  async removeCourse(
    @Req() req: Request,
    @Res() res: Response,
    @Param('course_id') courseId: number,
  ): Promise<void | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user || user.role !== 'admin')
      return res.status(new NoPermisionException().getStatus()).json({
        message: new NoPermisionException().message,
        status: new NoPermisionException().getStatus(),
      });

    const result = await this.courseService.removeCourse(courseId);

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
