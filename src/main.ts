import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';
import { HttpExceptionFilter } from './_common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableVersioning({ type: VersioningType.URI });

  app.enableCors({
    origin: configService.get<string>('ENDPOINT_CORS'),
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });
  const port = configService.get<number>('NODE_API_PORT') || 5000;
  await app.listen(port);
  Logger.log(
    `${await app.getUrl()} - Enviroment: ${configService.get<string>(
      'NODE_ENV',
    )}`,
    'Enviroment',
  );

  Logger.log(`Url for OpenApi: ${await app.getUrl()}/docs`, 'Swagger');
}
bootstrap();
