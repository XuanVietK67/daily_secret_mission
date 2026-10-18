import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  type ValidationError,
} from '@nestjs/common';
import type { Response } from 'express';

/** Every error leaves the API as `{ error: { code, message, details? } }` (docs/api.md). */
@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const { code, details } =
        typeof body === 'object'
          ? (body as { code?: string; details?: unknown })
          : {};
      res.status(status).json({
        error: {
          code: code ?? HttpStatus[status] ?? 'ERROR',
          message: exception.message,
          details,
        },
      });
      return;
    }

    // Errors from Express middleware such as body-parser (malformed JSON) follow the http-errors convention.
    const httpError = exception as {
      status?: unknown;
      expose?: unknown;
      message?: string;
    };
    if (typeof httpError.status === 'number' && httpError.expose === true) {
      res.status(httpError.status).json({
        error: {
          code: HttpStatus[httpError.status] ?? 'ERROR',
          message: httpError.message,
        },
      });
      return;
    }

    this.logger.error(exception);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    });
  }
}

/** ValidationPipe exceptionFactory: field-level details in the shared error shape. */
export const validationFailed = (errors: ValidationError[]) =>
  new BadRequestException({
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
    details: errors.map((e) => ({
      field: e.property,
      errors: Object.values(e.constraints ?? {}),
    })),
  });
