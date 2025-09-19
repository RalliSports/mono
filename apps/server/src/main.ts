import './tracing';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DatadogExceptionFilter } from './filters/datadog-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new DatadogExceptionFilter());
  // Enable CORS for production
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            process.env.FRONTEND_URL,
            'https://www.ralli.bet',
            'https://ralli.bet',
          ].filter(Boolean) // Remove any undefined values
        : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Api docs')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-para-session',
        in: 'header',
        description: 'Enter para session here',
      },
      'x-para-session',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
