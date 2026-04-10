"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instrumento = void 0;
class Instrumento {
    id;
    modeloMadeira;
    dataEntrada;
    reparoConcluido;
    custoReparo;
    luthierId;
    createdAt;
    updatedAt;
    constructor(id, modeloMadeira, dataEntrada, reparoConcluido, custoReparo, luthierId, createdAt, updatedAt) {
        this.id = id;
        this.modeloMadeira = modeloMadeira;
        this.dataEntrada = dataEntrada;
        this.reparoConcluido = reparoConcluido;
        this.custoReparo = custoReparo;
        this.luthierId = luthierId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Instrumento = Instrumento;
//# sourceMappingURL=instrumento.js.map