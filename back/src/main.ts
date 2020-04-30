import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';
import { AppModule } from './infrastructure/app.module';
import { EnvironmentConfigService } from './infrastructure/config/environment-config/environment-config.service';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  Sentry.init({ dsn: app.get(EnvironmentConfigService).get('SENTRY_DSN') });

  app.use(helmet());
  app.enableCors();

  const port: string = app.get(EnvironmentConfigService).get('PORT');
  await app.listen(port);
}

bootstrap();
