export interface LuthierDto {
  id: string;
  nomeMestre: string;
  dataAbertura: string | Date;
  certificada: boolean;
  bancadasNum: number;
}

export type CreateLuthierDto = Omit<LuthierDto, 'id'>;
export type UpdateLuthierDto = Partial<CreateLuthierDto>;
