import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BusinessException } from '../exceptions/business.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

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
      return response.status(status).json({
        ...base,
        code: body.code,
        message: body.message,
      });
    }

    // Resposta padronizada para HttpException genérica (incluindo BadRequest do class-validator)
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      let message = 'Erro de requisição';
      let details: string[] | Record<string, string[]> | undefined;

      if (typeof body === 'object' && body !== null) {
        const bodyObj = body as Record<string, any>;
        message = Array.isArray(bodyObj.message) ? 'Erro de validação' : (bodyObj.message || message);
        if (Array.isArray(bodyObj.message)) {
          details = bodyObj.message;
        } else if (bodyObj.errors) {
          details = bodyObj.errors;
        }
      } else if (typeof body === 'string') {
        message = body;
      }

      return response.status(status).json({
        ...base,
        code: status === 400 && details ? 'VALIDATION_ERROR' : 'HTTP_ERROR',
        message,
        ...(details ? { details } : {}),
      });
    }

    // Erros internos inesperados
    return response.status(status).json({
      ...base,
      code: 'INTERNAL_ERROR',
      message: 'Erro interno no servidor',
    });
  }
}
