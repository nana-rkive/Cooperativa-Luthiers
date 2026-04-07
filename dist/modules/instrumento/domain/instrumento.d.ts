export declare class Instrumento {
    readonly id: number | null;
    modeloMadeira: string;
    dataEntrada: Date;
    reparoConcluido: boolean;
    custoReparo: number;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: number | null, modeloMadeira: string, dataEntrada: Date, reparoConcluido: boolean, custoReparo: number, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
