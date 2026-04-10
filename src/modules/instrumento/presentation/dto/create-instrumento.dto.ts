import { ApiProperty } from '@nestjs/swagger';

export class CreateInstrumentoDto {
    @ApiProperty({ example: 'Ana Silva' })
    modeloMadeira: string;

    @ApiProperty({ example: 'ana@email.com' })
    dataEntrada: Date;

    @ApiProperty({ example: 'ana@email.com' })
    reparoConcluido: boolean;

    @ApiProperty({ example: 1 })
    luthierId: number;

    @ApiProperty({ example: 100 })
    custoReparo: number;
}