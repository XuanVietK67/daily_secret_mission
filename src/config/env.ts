import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

/** Every env var the app reads. Boot fails if one is missing or invalid. */
export class Env {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test' = 'development';

  @IsInt()
  PORT: number = 3000;

  @IsIn(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
  LOG_LEVEL: string = 'info';

  /** Pooled connection (Supabase transaction pooler) used at runtime. */
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  /** JWKS and issuer are derived from it. */
  @IsUrl({ require_tld: false, require_protocol: true })
  SUPABASE_URL: string;
}

export function validateEnv(raw: Record<string, unknown>): Env {
  const env = plainToInstance(Env, raw, { enableImplicitConversion: true });
  const errors = validateSync(env);
  if (errors.length > 0) {
    throw new Error(
      `Invalid environment:\n${errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('\n')}`,
    );
  }
  return env;
}
