export class Luthier {
  constructor(
    public readonly id: number | null,
    public nomeMestre: string,
    public dataAbertura: Date,
    public certificada: boolean,
    public bancadasNum: number,
  ) {
    this.validate();
  }

  private validate() {
    if (this.bancadasNum < 2) {
      throw new Error(
        'A oficina deve possuir no mínimo 2 bancadas para operar na cooperativa.',
      );
    }
    if (!this.nomeMestre || this.nomeMestre.trim().length === 0) {
      throw new Error('O nome do mestre luthier é obrigatório.');
    }
    if (new Date(this.dataAbertura) > new Date()) {
      throw new Error(
        'A data de abertura da oficina não pode ser uma data futura.',
      );
    }
  }
}
