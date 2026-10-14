import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
  type CryptoKey,
  SignJWT,
} from 'jose';
import { AppModule } from '../src/app.module.js';
import { JWKS } from '../src/auth/supabase-jwt.guard.js';

/**
 * Boots the real AppModule against the test database. Only the outside world is faked:
 * Supabase's JWKS is replaced by a local key pair, so tests mint their own tokens.
 */
export async function createTestApp() {
  const { publicKey, privateKey } = await generateKeyPair('ES256');
  const jwk = { ...(await exportJWK(publicKey)), kid: 'test', alg: 'ES256' };

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(JWKS)
    .useValue(createLocalJWKSet({ keys: [jwk] }))
    .compile();
  const app: INestApplication = moduleRef.createNestApplication();
  app.setGlobalPrefix('v1');
  await app.init();

  const issuer = `${app.get(ConfigService).get('SUPABASE_URL')}/auth/v1`;
  /** A Supabase-shaped access token for a new (or given) Learner id. */
  const token = (sub: string = randomUUID(), key: CryptoKey = privateKey) =>
    new SignJWT({ role: 'authenticated' })
      .setProtectedHeader({ alg: 'ES256', kid: 'test' })
      .setSubject(sub)
      .setIssuer(issuer)
      .setAudience('authenticated')
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(key);

  return { app, token };
}
