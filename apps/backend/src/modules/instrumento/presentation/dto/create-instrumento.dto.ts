import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsString,
  IsDate,
  MaxDate,
} from 'class-validator';

export class CreateInstrumentoDto {
  @ApiProperty({
    description: 'Modelo e madeira do instrumento',
    example: 'Violão de nylon',
  })
  @IsString()
  @IsNotEmpty({ message: 'O modelo/madeira do instrumento é obrigatório' })
  modeloMadeira: string;

  @ApiProperty({
    description: 'Data de entrada do instrumento na oficina',
    example: '2022-01-01',
  })
  @Type(() => Date)
  @IsDate({ message: 'Formato de data inválido' })
  @IsNotEmpty({ message: 'A data de entrada é obrigatória' })
  @MaxDate(new Date(), { message: 'A data de entrada não pode ser no futuro' })
  dataEntrada: Date;

  @ApiProperty({ description: 'Status do reparo', example: false })
  @IsBoolean()
  reparoConcluido: boolean;

  @ApiProperty({
    description: 'ID do luthier responsável pelo reparo',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'O ID do luthier é obrigatório' })
  luthierId: number;

  @ApiProperty({ description: 'Custo do reparo', example: 1250.2 })
  @IsNumber()
  @IsNotEmpty({ message: 'O custo do reparo é obrigatório' })
  @Min(0, { message: 'O custo do reparo deve ser maior que 0' })
  @Max(50000, { message: 'O custo do reparo não deve ultrapassar 50000' })
  custoReparo: number;
}
