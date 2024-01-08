import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { InvalidJWTTokenExceptionFilter } from 'backend-core/src/infra/jwt/invalid-jwt-token-exception.filter';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { jwtConfig } from 'backend-core/src/config/jwt/jwt-config';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { JWTAuthGuard } from 'backend-core/src/infra/jwt/jwt-guard';
import { AsyncLocalStorage } from 'async_hooks';
import { StorePayload } from 'rilata/src/app/async-store/types';
import { AppModule } from './app.module';

async function bootstrap() {
  const threadStore = new AsyncLocalStorage<StorePayload>();
  storeDispatcher.setThreadStore(threadStore);

  const jwtManager = new JSONWebTokenLibJWTManager(jwtConfig);
  const app = await NestFactory.create(AppModule.forRoot(jwtManager));

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

  app.useGlobalFilters(new InvalidJWTTokenExceptionFilter());
  app.useGlobalGuards(new JWTAuthGuard(jwtManager));

  await app.listen(3000);
}

bootstrap();
