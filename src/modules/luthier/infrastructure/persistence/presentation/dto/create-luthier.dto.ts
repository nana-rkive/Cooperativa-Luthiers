import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsBoolean, IsNumber } from "class-validator";

export class LuthierDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ example: "João Silva" })
    @IsString()
    nomeMestre: string;

    @ApiProperty({ example: "2022-01-01" })
    @IsDate()
    dataAbertura: Date;

    @ApiProperty({ example: true })
    @IsBoolean()
    certificada: boolean;

    @ApiProperty({ example: 2 })
    @IsNumber()
    bancadasNum: number;
}