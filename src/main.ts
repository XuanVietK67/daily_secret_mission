import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('v1');
  app.enableShutdownHooks();

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Daily Secret Mission API')
      .setVersion('1')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build(),
  );
  // The UI is for local use; /docs-json stays available to generate the Expo client.
  SwaggerModule.setup('docs', app, document, {
    ui: config.get('NODE_ENV', { infer: true }) !== 'production',
    jsonDocumentUrl: 'docs-json',
  });

  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
