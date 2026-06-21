import { LuthierDto } from './luthier.dto';

export interface InstrumentoDto {
  id: number;
  modeloMadeira: string;
  dataEntrada: string | Date;
  reparoConcluido: boolean;
  custoReparo: number;
  luthierId: number;
  luthier?: LuthierDto;
}

export interface CreateInstrumentoDto {
  modeloMadeira: string;
  dataEntrada: string | Date;
  reparoConcluido: boolean;
  custoReparo: number;
  luthierId: number;
}

export type UpdateInstrumentoDto = Partial<CreateInstrumentoDto>;
