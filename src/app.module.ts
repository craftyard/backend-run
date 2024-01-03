import { DynamicModule, Module } from '@nestjs/common';
import { RunMode } from 'rilata/src/app/types';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { SubjectReadNestModule } from 'cy-front-read/src/subject/nest-module';
import { WorkshopReadNestModule } from 'cy-front-read/src/workshop/nest-module';

@Module({})
export class AppModule {
  static forRoot(jwtManager: JSONWebTokenLibJWTManager): DynamicModule {
    const consoleLogger = new ConsoleLogger();
    const runMode: RunMode = 'dev';

    return {
      module: AppModule,
      imports: [
        SubjectReadNestModule.forRoot(consoleLogger, jwtManager, runMode),
        WorkshopReadNestModule.forRoot(consoleLogger, jwtManager, runMode),
      ],
    };
  }
}
