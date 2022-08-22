import { Inject, Injectable, InternalServerErrorException, Logger, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { catchError, lastValueFrom, throwError, timeout, TimeoutError }                                             from 'rxjs';
import { compareSync }                                                                                              from 'bcrypt';

import { ClientProxy }  from '@nestjs/microservices';
import { JwtService }   from '@nestjs/jwt';
import { ECONNREFUSED } from '@nestjs/microservices/constants';

import { ERROR_CONSTANTS } from '@domain/error.constant';
import { IUser }           from '@domain/interface/user.interface';
import { UserReadDto }     from '@domain/dto/user-read.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT') private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Go to user microservice to get user by email
      const user: UserReadDto = UserReadDto.fromUser(await this.getUserByEmail(email));

      // If user not found
      if (!user) throw new InternalServerErrorException('Invalid credentials', {
        code: ERROR_CONSTANTS.USER_NOT_FOUND,
        message: 'User does not exist'
      } as any);

      // If password is incorrect
      if (!compareSync(password, user?.password)) throw new UnauthorizedException('Invalid credentials');

      // Delete password from result
      delete user.password;
      return user;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...result} = user;
    const payload = {result, sub: user.id};

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload)
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }

  /**
   * Send message pattern to userClient to get user by email
   *
   * @param email
   * @returns {Promise<IUser>}
   */
  getUserByEmail = (email: string): Promise<IUser> => lastValueFrom(
    this.userClient.send({role: 'email', cmd: 'get'}, {email})
      .pipe(
        timeout(5000),
        catchError(err => {
          if (err instanceof TimeoutError) return throwError(() => new RequestTimeoutException());
          if (err.code === ECONNREFUSED) return throwError(() => new InternalServerErrorException('User service is not available', err));
          return throwError(() => err);
        }),
      )
  );
}
