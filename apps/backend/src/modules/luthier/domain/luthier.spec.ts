import { Luthier } from './luthier';

describe('Luthier (domain entity)', () => {
  const validArgs = (): ConstructorParameters<typeof Luthier> => [
    null,
    'João Silva',
    new Date('2010-05-15'),
    true,
    3,
  ];

  it('deve criar um luthier válido', () => {
    const luthier = new Luthier(...validArgs());
    expect(luthier.nomeMestre).toBe('João Silva');
    expect(luthier.bancadasNum).toBe(3);
    expect(luthier.certificada).toBe(true);
  });

  describe('validação de bancadasNum', () => {
    it('deve lançar erro quando bancadasNum for menor que 2', () => {
      const args = validArgs();
      args[4] = 1;
      expect(() => new Luthier(...args)).toThrow(
        'A oficina deve possuir no mínimo 2 bancadas',
      );
    });

    it('deve aceitar bancadasNum igual a 2', () => {
      const args = validArgs();
      args[4] = 2;
      expect(() => new Luthier(...args)).not.toThrow();
    });
  });

  describe('validação de nomeMestre', () => {
    it('deve lançar erro quando nomeMestre for vazio', () => {
      const args = validArgs();
      args[1] = '';
      expect(() => new Luthier(...args)).toThrow(
        'O nome do mestre luthier é obrigatório.',
      );
    });

    it('deve lançar erro quando nomeMestre for apenas espaços', () => {
      const args = validArgs();
      args[1] = '   ';
      expect(() => new Luthier(...args)).toThrow(
        'O nome do mestre luthier é obrigatório.',
      );
    });
  });

  describe('validação de dataAbertura', () => {
    it('deve lançar erro quando dataAbertura for no futuro', () => {
      const args = validArgs();
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      args[2] = futureDate;
      expect(() => new Luthier(...args)).toThrow(
        'A data de abertura da oficina não pode ser uma data futura.',
      );
    });

    it('deve aceitar dataAbertura no passado', () => {
      const args = validArgs();
      args[2] = new Date('2000-01-01');
      expect(() => new Luthier(...args)).not.toThrow();
    });
  });
});
