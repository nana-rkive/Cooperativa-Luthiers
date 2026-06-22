import { Instrumento } from './instrumento';

describe('Instrumento (domain entity)', () => {
    const validArgs = (): ConstructorParameters<typeof Instrumento> => [
        null,
        'Violão',
        new Date('2023-01-01'),
        false,
        100,
        1,
    ];

    it('deve criar um instrumento válido', () => {
        const instrumento = new Instrumento(...validArgs());
        expect(instrumento.modeloMadeira).toBe('Violão');
        expect(instrumento.custoReparo).toBe(100);
        expect(instrumento.reparoConcluido).toBe(false);
    });

    describe('validação de custoReparo', () => {
        it('deve lançar erro quando custoReparo for negativo', () => {
            const args = validArgs();
            args[4] = -1;
            expect(() => new Instrumento(...args)).toThrow('O custo do reparo deve estar entre 0 e 50000');
        });

        it('deve lançar erro quando custoReparo for maior que 50000', () => {
            const args = validArgs();
            args[4] = 50001;
            expect(() => new Instrumento(...args)).toThrow('O custo do reparo deve estar entre 0 e 50000');
        });

        it('deve aceitar custo igual a 0 quando reparo não está concluído', () => {
            const args = validArgs();
            args[3] = false;
            args[4] = 0;
            expect(() => new Instrumento(...args)).not.toThrow();
        });

        it('deve aceitar custo igual a 50000', () => {
            const args = validArgs();
            args[4] = 50000;
            expect(() => new Instrumento(...args)).not.toThrow();
        });
    });

    describe('validação de reparoConcluido + custoReparo', () => {
        it('deve lançar erro quando reparo está concluído mas custo é 0', () => {
            const args = validArgs();
            args[3] = true;
            args[4] = 0;
            expect(() => new Instrumento(...args)).toThrow('Um reparo concluído deve ter um custo maior que 0');
        });

        it('deve aceitar reparo concluído com custo positivo', () => {
            const args = validArgs();
            args[3] = true;
            args[4] = 500;
            expect(() => new Instrumento(...args)).not.toThrow();
        });
    });

    describe('validação de modeloMadeira', () => {
        it('deve lançar erro quando modeloMadeira for string vazia', () => {
            const args = validArgs();
            args[1] = '';
            expect(() => new Instrumento(...args)).toThrow('O modelo/madeira do instrumento é obrigatório');
        });

        it('deve lançar erro quando modeloMadeira for apenas espaços', () => {
            const args = validArgs();
            args[1] = '   ';
            expect(() => new Instrumento(...args)).toThrow('O modelo/madeira do instrumento é obrigatório');
        });
    });
});
