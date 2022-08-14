import { Inject, Injectable, Logger, RequestTimeoutException }          from '@nestjs/common';
import { catchError, lastValueFrom, throwError, timeout, TimeoutError } from 'rxjs';
import { compareSync }                                                  from 'bcrypt';
import { ClientProxy }                                                  from '@nestjs/microservices';
import { JwtService }                                                   from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT') private readonly client: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await lastValueFrom(this.client.send({role: 'email', cmd: 'get'}, {email})
        .pipe(timeout(5000), catchError(err => {
          if (err instanceof TimeoutError) return throwError(() => new RequestTimeoutException());
          return throwError(() => err);
        }),));

      if (compareSync(password, user?.password)) return user;

      return null;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user) {
    const payload = {user, sub: user.id};

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload)
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
