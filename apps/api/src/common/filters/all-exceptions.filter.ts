import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorCode } from '@app/types';
import { AppException } from '../errors/app.exception';
import { REQUEST_ID_HEADER } from '../middleware/request-id.middleware';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();
    const requestId =
      request.requestId ?? (request.headers[REQUEST_ID_HEADER] as string | undefined) ?? 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ErrorCode = ErrorCode.INTERNAL;
    let message = 'An unexpected error occurred';
    let details: unknown[] = [];

    if (exception instanceof AppException) {
      status = exception.httpStatus;
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (status === HttpStatus.UNAUTHORIZED) {
        code = ErrorCode.UNAUTHENTICATED;
      } else if (status === HttpStatus.FORBIDDEN) {
        code = ErrorCode.FORBIDDEN;
      } else if (status === HttpStatus.NOT_FOUND) {
        code = ErrorCode.RESOURCE_NOT_FOUND;
      } else if (status === HttpStatus.TOO_MANY_REQUESTS) {
        code = ErrorCode.RATE_LIMITED;
      } else if (status === HttpStatus.BAD_REQUEST) {
        code = ErrorCode.VALIDATION_ERROR;
      } else if (status === HttpStatus.CONFLICT) {
        code = ErrorCode.CONFLICT;
      }
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null && 'message' in body) {
        const msg = (body as { message: string | string[] }).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
        if ('details' in body && Array.isArray((body as { details: unknown[] }).details)) {
          details = (body as { details: unknown[] }).details;
        }
      }
    } else {
      this.logger.error({ requestId, err: exception }, 'Unhandled exception');
    }

    if (status >= 500) {
      this.logger.error({ requestId, code, message }, 'Server error');
    }

    response.status(status).json({
      error: {
        code,
        message: status >= 500 ? 'An unexpected error occurred' : message,
        requestId,
        details: code === ErrorCode.VALIDATION_ERROR ? details : [],
      },
    });
  }
}
