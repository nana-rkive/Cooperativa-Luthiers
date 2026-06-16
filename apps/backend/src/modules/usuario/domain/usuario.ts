export class Usuario {
    constructor(
        public readonly id: number | null,
        public primeiroNome: string,
        public sobrenome: string,
        public email: string,
        public senha: string,
        public ativo: boolean = false,
    ) {
        this.validate();
    }

    private validate() {
        if (!this.primeiroNome || this.primeiroNome.trim().length === 0) {
            throw new Error('O primeiro nome é obrigatório.');
        }
        if (!this.sobrenome || this.sobrenome.trim().length === 0) {
            throw new Error('O sobrenome é obrigatório.');
        }
        if (!this.email || this.email.trim().length === 0) {
            throw new Error('O e-mail é obrigatório.');
        }
        if (!this.senha || this.senha.trim().length === 0) {
            throw new Error('A senha é obrigatória.');
        }
    }
}
