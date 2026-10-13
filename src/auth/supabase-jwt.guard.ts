import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { isUUID } from 'class-validator';
import { jwtVerify, type JWTVerifyGetKey } from 'jose';
import type { Env } from '../config/env.js';
import { IS_PUBLIC } from './public.decorator.js';

/** Injection token for the key set, so tests can swap Supabase's remote JWKS for a local one. */
export const JWKS = Symbol('JWKS');

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private readonly issuer: string;

  constructor(
    private readonly reflector: Reflector,
    @Inject(JWKS) private readonly jwks: JWTVerifyGetKey,
    config: ConfigService<Env, true>,
  ) {
    this.issuer = `${config.get('SUPABASE_URL', { infer: true })}/auth/v1`;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        ctx.getHandler(),
        ctx.getClass(),
      ])
    )
      return true;

    const req = ctx.switchToHttp().getRequest();
    const [scheme, token] = (req.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token)
      throw new UnauthorizedException('Missing bearer token');

    let sub: string | undefined;
    try {
      ({
        payload: { sub },
      } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: 'authenticated',
      }));
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    if (!sub || !isUUID(sub)) throw new UnauthorizedException('Invalid token');

    req.learner = { id: sub };
    return true;
  }
}
