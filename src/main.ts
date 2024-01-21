import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as process from 'process';
import { AppModule } from './app.module';
import { ValidationException } from './common/exceptions/validation.exception';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('LensLend')
    .setDescription('The LensLend API description')
    .setVersion(process.env.VERSION || '0.0.0')
    .addBearerAuth()
    .addSecurity('refresh_token', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
