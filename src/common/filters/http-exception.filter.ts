import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Normalizar message para que siempre sea string | string[]
    const normalizedMessage =
      typeof message === 'string'
        ? message
        : Array.isArray((message as any).message)
          ? (message as any).message
          : (message as any).message || String(message);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message: normalizedMessage,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // No exponer stack traces ni detalles internos
    response.status(status).json(errorResponse);
  }
}