import { AllExceptionFilter } from './all-exceptions.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { BusinessException } from '../exceptions/business.exception';

describe('AllExceptionFilter', () => {
  let filter: AllExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: jest.Mocked<ArgumentsHost>;

  beforeEach(() => {
    filter = new AllExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/test-url',
    };

    const mockHttpArgumentHost = {
      getResponse: jest.fn().mockReturnValue(mockResponse),
      getRequest: jest.fn().mockReturnValue(mockRequest),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpArgumentHost),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };
  });

  it('deve formatar BusinessException corretamente', () => {
    const exception = new BusinessException(
      'TEST_CODE',
      'Erro de negócio de teste',
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-url',
        code: 'TEST_CODE',
        message: 'Erro de negócio de teste',
      }),
    );
  });

  it('deve formatar HttpException padrão corretamente', () => {
    const exception = new HttpException(
      'Erro de requisição padrão',
      HttpStatus.FORBIDDEN,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.FORBIDDEN,
        path: '/test-url',
        code: 'HTTP_ERROR',
        message: 'Erro de requisição padrão',
      }),
    );
  });

  it('deve formatar HttpException de validação (BadRequest com array de mensagens) corretamente', () => {
    const exception = new HttpException(
      {
        message: ['campo1 deve ser email', 'campo2 é obrigatório'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-url',
        code: 'VALIDATION_ERROR',
        message: 'Erro de validação',
        details: ['campo1 deve ser email', 'campo2 é obrigatório'],
      }),
    );
  });

  it('deve tratar exceções genéricas (erros de runtime não mapeados) como INTERNAL_SERVER_ERROR', () => {
    const exception = new Error('Erro de banco de dados ou runtime');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test-url',
        code: 'INTERNAL_ERROR',
        message: 'Erro interno no servidor',
      }),
    );
  });
});
