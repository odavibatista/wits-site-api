import { Body, Controller, HttpException, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { AllExceptionsFilterDTO } from '../../../shared/domain/dtos/errors/AllException.filter.dto';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { CreateUserRequestDTO, CreateUserResponseDTO } from '../domain/requests/CreateUser.request.dto';
import { Request, Response } from 'express';
import { LoginUserBodyDTO, LoginUserResponseDTO } from '../domain/requests/LoginUser.request.dto';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { InvalidCredentialsException } from '../domain/errors/InvalidCredentials.exception';

@Controller('user')
@ApiTags('Usuário')
export class UserController {
    constructor(
        private readonly userService: UserService
      ) {}

      @Post('register')
      @ApiResponse({
        status: 200,
        description: 'Usuário criado com sucesso.',
        type: CreateUserResponseDTO,
      })
      @ApiResponse({
        status: new EmailAlreadyRegisteredException().getStatus(),
        description: new EmailAlreadyRegisteredException().message,
        type: AllExceptionsFilterDTO
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
        @Body() body: CreateUserRequestDTO
      ): Promise<CreateUserResponseDTO | AllExceptionsFilterDTO>  {
        if (req.user) throw new UnauthorizedException();

        const result = await this.userService.register(body)

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
            type: AllExceptionsFilterDTO
        })
        @ApiResponse({
            status: new InvalidCredentialsException().getStatus(),
            description: new InvalidCredentialsException().message,
            type: AllExceptionsFilterDTO,
        })
        async login(
            @Req() req: Request,
            @Res() res: Response,
            @Body() body: LoginUserBodyDTO
        ): Promise<LoginUserResponseDTO | AllExceptionsFilterDTO>   {
            if (req.user) throw new UnauthorizedException();

            const result = await this.userService.login(body)

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
