import { ApiProperty } from '@nestjs/swagger';

export class CreateInstrumentoDto {
    @ApiProperty({ example: 'Ana Silva' })
    modeloMadeira: string;

    @ApiProperty({ example: 'ana@email.com' })
    dataEntrada: Date;

    @ApiProperty({ example: 'ana@email.com' })
    reparoConcluido: boolean;

    @ApiProperty({ example: 'ana@email.com' })
    custoReparo: number;
}