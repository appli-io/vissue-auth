import { Inject, Injectable } from '@nestjs/common';
import { ConfigService }      from '@nestjs/config';
import { JwtConfig }          from '@domain/config/jwt.interface';

@Injectable()
export class EnvironmentConfigService implements JwtConfig {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshTokenExpiration(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }
}
