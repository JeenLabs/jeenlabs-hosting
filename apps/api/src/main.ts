import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { parseAllowedOrigins } from '@app/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';
import { BETTER_AUTH, type BetterAuthInstance } from './infra/better-auth/better-auth';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  const allowedOrigins = parseAllowedOrigins(
    process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000',
  );

  app.use(helmet());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.use(requestIdMiddleware);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const auth = app.get<BetterAuthInstance>(BETTER_AUTH);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.all('/api/auth/*', toNodeHandler(auth));

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
}

void bootstrap();
