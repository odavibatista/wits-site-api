import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
} from '../domain/requests/CreateUser.request.dto';
import { Request, Response } from 'express';
import {
  LoginUserBodyDTO,
  LoginUserResponseDTO,
} from '../domain/requests/LoginUser.request.dto';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { InvalidCredentialsException } from '../domain/errors/InvalidCredentials.exception';
import { HomeDataResponseDTO } from '../domain/requests/HomeData.request.dto';
import { NotAuthenticatedException } from '../../../shared/domain/errors/NotAuthenticated.exception';
import { GetUserProfileResponseResponseDTO } from '../domain/requests/GetUserProfile.request.dto';
import {
  EditProfileRequestDTO,
  EditProfileResponseDTO,
} from '../domain/requests/EditProfile.request.dto';

@Controller('user')
@ApiTags('Usuário')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso.',
    type: CreateUserResponseDTO,
  })
  @ApiResponse({
    status: new EmailAlreadyRegisteredException().getStatus(),
    description: new EmailAlreadyRegisteredException().message,
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
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO | AllExceptionsFilterDTO> {
    if (req.user) throw new UnauthorizedException();

    const result = await this.userService.register(body);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Usuário logado com sucesso.',
    type: CreateUserResponseDTO,
  })
  @ApiResponse({
    status: new UserNotFoundException().getStatus(),
    description: new UserNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new InvalidCredentialsException().getStatus(),
    description: new InvalidCredentialsException().message,
    type: AllExceptionsFilterDTO,
  })
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginUserBodyDTO,
  ): Promise<LoginUserResponseDTO | AllExceptionsFilterDTO> {
    if (req.user) throw new UnauthorizedException();

    const result = await this.userService.login(body);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }
  @Get('home-data')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new UnauthorizedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new CommonException().getStatus(),
    description: new CommonException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 300,
    description: 'Dados trazidos com sucesso.',
    type: HomeDataResponseDTO,
  })
  async homeData(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<HomeDataResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const result = await this.userService.homeData(user.id);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }

  @Get('/profile')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new UnauthorizedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UserNotFoundException().getStatus(),
    description: new UserNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Dados trazidos com sucesso.',
    type: GetUserProfileResponseResponseDTO,
  })
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<GetUserProfileResponseResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const result = await this.userService.getProfile(user.id);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(200).json(result);
    }
  }

  @Patch('/profile')
  @ApiBearerAuth('user-token')
  @ApiResponse({
    status: new NotAuthenticatedException().getStatus(),
    description: new UnauthorizedException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: new UserNotFoundException().getStatus(),
    description: new UserNotFoundException().message,
    type: AllExceptionsFilterDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Dados atualizados com sucesso.',
    type: EditProfileResponseDTO,
  })
  async updateProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: EditProfileRequestDTO,
  ): Promise<EditProfileResponseDTO | AllExceptionsFilterDTO> {
    const user = req.user;

    if (!user) {
      return res.status(new NotAuthenticatedException().getStatus()).json({
        message: new NotAuthenticatedException().message,
        status: new NotAuthenticatedException().getStatus(),
      });
    }

    const result = await this.userService.alterProfile(user.id, body);

    if (result instanceof HttpException) {
      return res.status(result.getStatus()).json({
        message: result.message,
        status: result.getStatus(),
      });
    } else {
      return res.status(201).json(result);
    }
  }
}
