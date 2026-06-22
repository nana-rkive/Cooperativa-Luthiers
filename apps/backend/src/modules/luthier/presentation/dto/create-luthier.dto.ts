import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateLuthierDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do mestre luthier',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome do mestre luthier é obrigatório' })
  nomeMestre: string;

  @ApiProperty({
    example: '2022-01-01',
    description: 'Data de abertura da oficina (YYYY-MM-DD)',
  })
  @IsDateString(
    {},
    {
      message:
        'A data de abertura deve ser uma data válida no formato YYYY-MM-DD',
    },
  )
  @IsNotEmpty({ message: 'A data de abertura é obrigatória' })
  dataAbertura: Date;

  @ApiProperty({
    example: true,
    description: 'Indica se a oficina possui certificação profissional',
  })
  @IsBoolean()
  certificada: boolean;

  @ApiProperty({
    example: 3,
    description: 'Quantidade de bancadas de trabalho (mínimo 2)',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'O número de bancadas é obrigatório' })
  bancadasNum: number;
}
