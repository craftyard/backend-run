import { DynamicModule, Module } from '@nestjs/common';
import { RunMode } from 'rilata/src/app/types';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { SubjectWorkshopReadNestModule } from 'cy-front-read/src/subject-workshop/nest-module';

@Module({})
export class AppModule {
  static forRoot(jwtManager: JSONWebTokenLibJWTManager): DynamicModule {
    const consoleLogger = new ConsoleLogger();
    const runMode: RunMode = 'dev';

    return {
      module: AppModule,
      imports: [
        SubjectWorkshopReadNestModule.forRoot(consoleLogger, jwtManager, runMode),
      ],
    };
  }
}
