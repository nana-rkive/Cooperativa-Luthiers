import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';

describe('BusinessException', () => {
    it('deve criar uma exceção com código e mensagem', () => {
        const ex = new BusinessException('AUTH_001', 'E-mail já cadastrado');

        expect(ex.code).toBe('AUTH_001');
        expect(ex.getStatus()).toBe(HttpStatus.BAD_REQUEST); // default
    });

    it('deve usar o httpStatus fornecido', () => {
        const ex = new BusinessException('AUTH_005', 'Não encontrado', HttpStatus.NOT_FOUND);
        expect(ex.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('deve incluir code e message no corpo da resposta', () => {
        const ex = new BusinessException('LUTHIER_002', 'Mínimo de 2 bancadas');
        const body = ex.getResponse() as { code: string; message: string };

        expect(body.code).toBe('LUTHIER_002');
        expect(body.message).toBe('Mínimo de 2 bancadas');
    });

    it('deve ser instância de HttpException', () => {
        const ex = new BusinessException('X', 'msg');
        const { HttpException } = require('@nestjs/common');
        expect(ex).toBeInstanceOf(HttpException);
    });
});
