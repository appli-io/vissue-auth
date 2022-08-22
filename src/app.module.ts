import { Module }       from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getEnvPath }              from '@infrastructure/helpers/env.helper';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { LoggerModule }            from '@infrastructure/logger/logger.module';
import { ExceptionsModule }        from '@infrastructure/exceptions/exceptions.module';

import { DomainModule }  from '@domain/domain.module';
import { AppController } from './app.controller';
import { AuthModule }    from './modules/auth/auth.module';
import { AppService }    from './app.service';

const envFilePath: string = getEnvPath(`${ __dirname }/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath, isGlobal: true}),
    EnvironmentConfigModule,
    LoggerModule,
    ExceptionsModule,
    DomainModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
