import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';

/** Skips the Supabase JWT guard. Only for routes like /v1/health. */
export const Public = () => SetMetadata(IS_PUBLIC, true);
