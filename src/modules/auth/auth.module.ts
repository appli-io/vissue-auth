import { Module }               from '@nestjs/common';
import { AuthService }          from './auth.service';
import { ClientsModule }        from '@nestjs/microservices';
import { JwtModule }            from '@nestjs/jwt';
import { JwtStrategy }          from './jwt.strategy';
import { LocalStrategy }        from './local.strategy';
import { AuthController }       from './auth.controller';
import { USER_CLIENT_REGISTRY } from '../../config/constant.config';

@Module({
  imports: [
    ClientsModule.register([USER_CLIENT_REGISTRY]),
    JwtModule.register(
      {
        secret: 'vissue-key',
        signOptions: {expiresIn: '60s'}
      }
    )

  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})

export class AuthModule {}
