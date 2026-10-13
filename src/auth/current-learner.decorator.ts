import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** The Learner behind the request, taken from the verified token's `sub`; never from the request body. */
export interface AuthLearner {
  id: string;
}

export const CurrentLearner = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthLearner =>
    ctx.switchToHttp().getRequest().learner,
);
