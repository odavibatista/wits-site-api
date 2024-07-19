import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserRequestDTO, CreateUserResponseDTO } from '../domain/requests/CreateUser.request.dto';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { emailValidate } from '../../../shared/utils/email.validator';
import { passwordValidate } from '../../../shared/utils/password.validator';
import { JWTProvider } from '../providers/jwt.provider';
import { HashProvider } from '../providers/hash.provider';
import { nameValidate } from '../../../shared/utils/username.validator';
import { LoginUserBodyDTO, LoginUserResponseDTO } from '../domain/requests/LoginUser.request.dto';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { InvalidCredentialsException } from '../domain/errors/InvalidCredentials.exception';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { UsernameAlreadyRegisteredException } from '../domain/errors/UsernameAlreadyRegistered.exception';
import { UserScoreRepository } from '../../user-score/repository/user-score-repository';
import { HomeDataResponseDTO } from '../domain/requests/HomeData.request.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userScoreRepository: UserScoreRepository,
        private jwtProvider: JWTProvider,
        private hashProvider: HashProvider,
    )   {}

    async register(credentials: CreateUserRequestDTO): Promise<CreateUserResponseDTO | EmailAlreadyRegisteredException | UnprocessableDataException>    {
        if (!nameValidate(credentials.username)) throw new UnprocessableDataException('Nome inválido.');

        if (!emailValidate(credentials.email) || credentials.email.length < 10 || credentials.email.length > 50) throw new UnprocessableDataException('Email inválido.');

        if (!passwordValidate(credentials.password)) throw new UnprocessableDataException('Senha inválida.');

        const userWithSameEmail = await this.userRepository.findOne({ where: { email: credentials.email } })

        if (userWithSameEmail) throw new EmailAlreadyRegisteredException();

        const userWithSameUsername = await this.userRepository.findOne({ where: { username: credentials.username } })

        if (userWithSameUsername) throw new UsernameAlreadyRegisteredException()

        const password = await this.hashProvider.hash(credentials.password);

        const user = await this.userRepository.save({
            username: credentials.username,
            email: credentials.email,
            password: password,
            role: 'common'
        })

        await this.userScoreRepository.save({
            user_id: user.id_user,
            total_score: 0,
        })

        const token = this.jwtProvider.generate({
            payload: {
              id: user.id_user,
              role: 'common',
            },
          })

          const response = {
            user: {
                id: user.id_user,
                username: user.username,
                role: 'common',
            },
            token: token,
          };

    
          return response;
    }

    async login(loginDto: LoginUserBodyDTO): Promise<LoginUserResponseDTO | UserNotFoundException | InvalidCredentialsException>  {
        if (!loginDto.username) throw new UnprocessableDataException('Nome de usuário inválido.');

        const user = await this.userRepository.findOne({
            where: { username: loginDto.username },
        });

        if (!user) 
          throw new UserNotFoundException();

        const isPasswordValid: boolean = await this.hashProvider.compare(
            loginDto.inserted_password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }   else    {
            const token = this.jwtProvider.generate({
                payload: {
                  id: user.id_user,
                  role: user.role,
                },
                expiresIn: '30d',
              });

            return {
                user: {
                    id: user.id_user,
                    name: user.username,
                    role: user.role,
                },
                token: token,
            }
        }
    }

    async homeData(user_id: number): Promise<HomeDataResponseDTO | UserNotFoundException> {
        const user = await this.userRepository.findOne({
            where: { id_user: user_id },
        });

        if (!user) throw new UserNotFoundException();

        const userScore = await this.userScoreRepository.findOne({
            where: { user_id: user_id },
        });

        return {
          user: {
            id: user.id_user,
            username: user.username,
            score: userScore.total_score,
            role: user.role,
          }
        }
    }
}

export class UserClearingService {
    constructor(
      private userRepository: UserRepository
    ) {}
  
    public async wipe(): Promise<void> {
      try {
        await this.userRepository.clear();
      } catch (error) {
        throw new CommonException(error);
      }
    }
}