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

    // Resposta padronizada para HttpException genérica
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      return response.status(status).json({
        ...base,
        ...(typeof body === 'object' ? body : { message: body }),
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
