import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const base = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Resposta padronizada para BusinessException: { code, message, details? }
    if (exception instanceof BusinessException) {
      const body = exception.getResponse() as { code: string; message: string };
      response.status(status).json({
        ...base,
        code: body.code,
        message: body.message,
      });
      return;
    }

    // Resposta padronizada para HttpException genérica (incluindo BadRequest do class-validator)
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      let message = 'Erro de requisição';
      let details: string[] | undefined;

      if (typeof body === 'object' && body !== null) {
        const bodyObj = body as { message?: unknown; errors?: unknown };
        message = Array.isArray(bodyObj.message)
          ? 'Erro de validação'
          : typeof bodyObj.message === 'string'
            ? bodyObj.message
            : message;
        if (Array.isArray(bodyObj.message)) {
          details = bodyObj.message as string[];
        } else if (Array.isArray(bodyObj.errors)) {
          details = bodyObj.errors as string[];
        }
      } else if (typeof body === 'string') {
        message = body;
      }

      response.status(status).json({
        ...base,
        code: status === 400 && details ? 'VALIDATION_ERROR' : 'HTTP_ERROR',
        message,
        ...(details ? { details } : {}),
      });
      return;
    }

    // Erros internos inesperados
    response.status(status).json({
      ...base,
      code: 'INTERNAL_ERROR',
      message: 'Erro interno no servidor',
    });
  }
}
