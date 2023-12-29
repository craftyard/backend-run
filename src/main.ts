import { NestFactory } from '@nestjs/core';
import { InvalidJWTTokenExceptionFilter } from 'backend-core/src/infra/jwt/invalid-jwt-token-exception.filter';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { JWTConfig } from 'backend-core/src/config/jwt/types';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { JWTAuthGuard } from 'backend-core/src/infra/jwt/jwt-guard';
import { AsyncLocalStorage } from 'async_hooks';
import { StorePayload } from 'rilata/src/app/async-store/types';
import { AppModule } from './app.module';

async function bootstrap() {
  const jwtConfig: JWTConfig = {
    algorithm: 'RS512',
    privateKey: process.env.JWT_PRIVATE_KEY as string,
    publicKey: process.env.JWT_PUBLIC_KEY as string,
    accessTokenExpiresIn: '99d',
    refreshTokenExpiresIn: '3d',
  };

  const threadStore = new AsyncLocalStorage<StorePayload>();
  storeDispatcher.setThreadStore(threadStore);

  const jwtManager = new JSONWebTokenLibJWTManager(jwtConfig);
  const app = await NestFactory.create(AppModule.forRoot(jwtManager));
  app.useGlobalFilters(new InvalidJWTTokenExceptionFilter());
  app.useGlobalGuards(new JWTAuthGuard(jwtManager));
  await app.listen(3001);
}
bootstrap();
