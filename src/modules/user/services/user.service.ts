import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
} from '../domain/requests/CreateUser.request.dto';
import { UnprocessableDataException } from '../../../shared/domain/errors/UnprocessableData.exception';
import { EmailAlreadyRegisteredException } from '../domain/errors/EmailAlreadyRegistered.exception';
import { emailValidate } from '../../../shared/utils/email.validator';
import { passwordValidate } from '../../../shared/utils/password.validator';
import { JWTProvider } from '../providers/jwt.provider';
import { HashProvider } from '../providers/hash.provider';
import { nameValidate } from '../../../shared/utils/username.validator';
import {
  LoginUserBodyDTO,
  LoginUserResponseDTO,
} from '../domain/requests/LoginUser.request.dto';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { InvalidCredentialsException } from '../domain/errors/InvalidCredentials.exception';
import { CommonException } from '../../../shared/domain/errors/Common.exception';
import { UsernameAlreadyRegisteredException } from '../domain/errors/UsernameAlreadyRegistered.exception';
import { UserScoreRepository } from '../../user-score/repository/user-score-repository';
import { HomeDataResponseDTO } from '../domain/requests/HomeData.request.dto';
import { UserCourseConcludedRepository } from '../../user-courses-concluded/repository/user-courses-concluded.repository';
import { GetUserProfileResponseResponseDTO } from '../domain/requests/GetUserProfile.request.dto';
import {
  EditProfileRequestDTO,
  EditProfileResponseDTO,
} from '../domain/requests/EditProfile.request.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userScoreRepository: UserScoreRepository,
    private readonly userCoursesConcludedRepository: UserCourseConcludedRepository,
    private jwtProvider: JWTProvider,
    private hashProvider: HashProvider,
  ) {}

  /* This service registers the user in the database if all the criterias are met */
  async register(
    credentials: CreateUserRequestDTO,
  ): Promise<
    | CreateUserResponseDTO
    | EmailAlreadyRegisteredException
    | UnprocessableDataException
  > {
    if (
      !nameValidate(credentials.username) ||
      credentials.username.length < 5 ||
      credentials.username.length > 15
    )
      throw new UnprocessableDataException('Nome inválido.');

    if (
      !emailValidate(credentials.email) ||
      credentials.email.length < 10 ||
      credentials.email.length > 50
    )
      throw new UnprocessableDataException('Email inválido.');

    if (!passwordValidate(credentials.password))
      throw new UnprocessableDataException('Senha inválida.');

    await this.userRepository
      .findByUsername(credentials.username)
      .then((foundUser) => {
        if (foundUser && foundUser?.id_user !== user.id_user)
          throw new UsernameAlreadyRegisteredException();
      });

    await this.userRepository
      .findByEmail(credentials.email)
      .then((foundUser) => {
        if (foundUser && foundUser?.id_user !== user.id_user)
          throw new EmailAlreadyRegisteredException();
      });

    const hash = await this.hashProvider.hash(credentials.password);

    const user = await this.userRepository.save({
      username: credentials.username,
      email: credentials.email,
      password: hash,
      role: 'common',
    });

    await this.userScoreRepository.save({
      user_id: user.id_user,
      total_score: 0,
    });

    const token = this.jwtProvider.generate({
      payload: {
        id: user.id_user,
        role: 'common',
      },
    });

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

  /* This will compare the credentials with the ones in the database and give the auth token it the password is correct */
  async login(
    loginDto: LoginUserBodyDTO,
  ): Promise<
    LoginUserResponseDTO | UserNotFoundException | InvalidCredentialsException
  > {
    if (!loginDto.username)
      throw new UnprocessableDataException('Nome de usuário inválido.');

    const user = await this.userRepository.findByUsername(loginDto.username);

    if (!user) throw new UserNotFoundException();

    const isPasswordValid: boolean = await this.hashProvider.compare(
      loginDto.inserted_password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    } else {
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
      };
    }
  }

  /* Validating the user's existance. This will be used as an auxiliary endpoint for user data and session in the front-end. */
  async homeData(
    user_id: number,
  ): Promise<HomeDataResponseDTO | UserNotFoundException> {
    const user = await this.userRepository.findById(user_id);

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
      },
    };
  }

  /* Getting all the data for the user's profile, so it can be shown in the front-end's user profile page. */
  async getProfile(
    id: number,
  ): Promise<GetUserProfileResponseResponseDTO | UserNotFoundException> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const userScore = await this.userScoreRepository.findOne({
      where: { user_id: id },
    });

    const courses_concluded = await this.userCoursesConcludedRepository.count({
      where: { user_id: id },
    });

    return {
      username: user.username,
      email: user.email,
      user_score: userScore.total_score,
      courses_completed: courses_concluded,
      member_since: String(user.created_at),
    };
  }

  /* Receiving data to change the data from a single user's profile */
  async alterProfile(
    id: number,
    data: EditProfileRequestDTO,
  ): Promise<
    | EditProfileResponseDTO
    | EmailAlreadyRegisteredException
    | UsernameAlreadyRegisteredException
    | UnprocessableDataException
    | UserNotFoundException
  > {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException();

    await this.userRepository
      .findByUsername(data.username)
      .then((foundUser) => {
        if (foundUser && foundUser?.id_user !== user.id_user)
          throw new UsernameAlreadyRegisteredException();
      });

    await this.userRepository.findByEmail(data.email).then((foundUser) => {
      if (foundUser && foundUser?.id_user !== user.id_user)
        throw new EmailAlreadyRegisteredException();
    });

    if (
      !nameValidate(data.username) ||
      data.username.length < 5 ||
      data.username.length > 15
    )
      throw new UnprocessableDataException('Nome inválido.');

    if (
      !emailValidate(data.email) ||
      data.email.length < 10 ||
      data.email.length > 50
    )
      throw new UnprocessableDataException('Email inválido.');

    await this.userRepository.update(id, {
      username: data.username,
      email: data.email,
    });

    return {
      username: data.username,
      email: data.email,
    };
  }

  /* This will be used for the user to delete his own account using a soft delete method */
  async softDelete(id: number): Promise<void | UserNotFoundException> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException();

    await this.userRepository.softDeleteById(id);
  }
}

export class UserClearingService {
  constructor(private userRepository: UserRepository) {}

  public async wipe(): Promise<void> {
    try {
      await this.userRepository.clear();
    } catch (error) {
      throw new CommonException(error);
    }
  }
}
