import { NestFactory } from '@nestjs/core';
import { Transport }   from '@nestjs/microservices';
import { Logger }      from '@nestjs/common';

import { AllExceptionFilter }  from '@infrastructure/common/filter/exceptions.filter';
import { LoggerService }       from '@infrastructure/logger/logger.service';
import { ResponseInterceptor } from '@infrastructure/common/interceptor/response.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4000
    }
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  Logger.log('Auth microservice running', 'MainContext');
}

bootstrap().then();
