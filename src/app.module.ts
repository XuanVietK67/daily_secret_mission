import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module.js';
import { type Env, validateEnv } from './config/env.js';
import { ErrorFilter, validationFailed } from './error.filter.js';
import { HealthController } from './health.controller.js';
import { LearnersModule } from './learners/learners.module.js';
import { LexiconModule } from './lexicon/lexicon.module.js';
import { MissionsModule } from './missions/missions.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        pinoHttp: {
          level: config.get('LOG_LEVEL', { infer: true }),
          redact: ['req.headers.authorization'],
          // Readable one-liners locally; JSON elsewhere so Render's log stream can search it.
          transport:
            config.get('NODE_ENV', { infer: true }) === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    ignore: 'pid,hostname,req.headers,res.headers',
                  },
                }
              : undefined,
        },
      }),
    }),
    TerminusModule,
    PrismaModule,
    AuthModule,
    LearnersModule,
    LexiconModule,
    MissionsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: validationFailed,
      }),
    },
    { provide: APP_FILTER, useClass: ErrorFilter },
  ],
})
export class AppModule {}
