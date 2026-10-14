import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { createRemoteJWKSet } from 'jose';
import type { Env } from '../config/env.js';
import { JWKS, SupabaseJwtGuard } from './supabase-jwt.guard.js';

@Module({
  providers: [
    {
      provide: JWKS,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        createRemoteJWKSet(
          new URL(
            `${config.get('SUPABASE_URL', { infer: true })}/auth/v1/.well-known/jwks.json`,
          ),
        ),
    },
    { provide: APP_GUARD, useClass: SupabaseJwtGuard },
  ],
})
export class AuthModule {}
