import { Usuario } from './usuario';

describe('Usuario (domain entity)', () => {
    const validArgs = (): ConstructorParameters<typeof Usuario> => [
        null,
        'Maria',
        'Souza',
        'maria@example.com',
        'hashedpassword123',
        false,
        'luthier',
        null,
    ];

    it('deve criar um usuário válido', () => {
        const usuario = new Usuario(...validArgs());
        expect(usuario.primeiroNome).toBe('Maria');
        expect(usuario.sobrenome).toBe('Souza');
        expect(usuario.email).toBe('maria@example.com');
        expect(usuario.ativo).toBe(false);
        expect(usuario.role).toBe('luthier');
    });

    describe('validação de primeiroNome', () => {
        it('deve lançar erro quando primeiroNome for vazio', () => {
            const args = validArgs();
            args[1] = '';
            expect(() => new Usuario(...args)).toThrow('O primeiro nome é obrigatório.');
        });

        it('deve lançar erro quando primeiroNome for apenas espaços', () => {
            const args = validArgs();
            args[1] = '   ';
            expect(() => new Usuario(...args)).toThrow('O primeiro nome é obrigatório.');
        });
    });

    describe('validação de sobrenome', () => {
        it('deve lançar erro quando sobrenome for vazio', () => {
            const args = validArgs();
            args[2] = '';
            expect(() => new Usuario(...args)).toThrow('O sobrenome é obrigatório.');
        });
    });

    describe('validação de email', () => {
        it('deve lançar erro quando email for vazio', () => {
            const args = validArgs();
            args[3] = '';
            expect(() => new Usuario(...args)).toThrow('O e-mail é obrigatório.');
        });
    });

    describe('validação de senha', () => {
        it('deve lançar erro quando senha for vazia', () => {
            const args = validArgs();
            args[4] = '';
            expect(() => new Usuario(...args)).toThrow('A senha é obrigatória.');
        });

        it('deve lançar erro quando senha for apenas espaços', () => {
            const args = validArgs();
            args[4] = '   ';
            expect(() => new Usuario(...args)).toThrow('A senha é obrigatória.');
        });
    });

    it('deve usar defaults corretos quando opcionais são omitidos', () => {
        const usuario = new Usuario(null, 'João', 'Melo', 'joao@ex.com', 'abc123');
        expect(usuario.ativo).toBe(false);
        expect(usuario.role).toBe('luthier');
        expect(usuario.tokenAtivacao).toBeNull();
    });
});
