export class Instrumento {
    constructor(
        public readonly id: number | null,
        public modeloMadeira: string,
        public dataEntrada: Date,
        public reparoConcluido: boolean,
        public custoReparo: number,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}
