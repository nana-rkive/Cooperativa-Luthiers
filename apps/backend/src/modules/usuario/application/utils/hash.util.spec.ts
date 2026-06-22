import { hashPassword, comparePassword } from './hash.util';

describe('hash.util', () => {
  describe('hashPassword()', () => {
    it('deve retornar uma string hash diferente da senha original', async () => {
      const senha = 'minhaSenhaSegura';
      const hash = await hashPassword(senha);
      expect(hash).not.toBe(senha);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(20);
    });

    it('deve gerar hashes diferentes para chamadas repetidas (salt aleatório)', async () => {
      const senha = 'minhaSenhaSegura';
      const hash1 = await hashPassword(senha);
      const hash2 = await hashPassword(senha);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword()', () => {
    it('deve retornar true quando a senha corresponde ao hash', async () => {
      const senha = 'minhaSenh@123';
      const hash = await hashPassword(senha);
      const result = await comparePassword(senha, hash);
      expect(result).toBe(true);
    });

    it('deve retornar false quando a senha não corresponde ao hash', async () => {
      const hash = await hashPassword('senhaCorreta');
      const result = await comparePassword('senhaErrada', hash);
      expect(result).toBe(false);
    });
  });
});
