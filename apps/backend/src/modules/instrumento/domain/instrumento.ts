export class Instrumento {
  constructor(
    public readonly id: number | null,
    public modeloMadeira: string,
    public dataEntrada: Date,
    public reparoConcluido: boolean,
    public custoReparo: number,
    public luthierId: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    this.validate();
  }
  private validate() {
    if (this.custoReparo < 0 || this.custoReparo > 50000) {
      throw new Error('O custo do reparo deve estar entre 0 e 50000');
    }

    if (this.reparoConcluido && this.custoReparo <= 0) {
      throw new Error('Um reparo concluído deve ter um custo maior que 0');
    }
    if (!this.modeloMadeira || this.modeloMadeira.trim().length === 0) {
      throw new Error('O modelo/madeira do instrumento é obrigatório');
    }
  }
}
