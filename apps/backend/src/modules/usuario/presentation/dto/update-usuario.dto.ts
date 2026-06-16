import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUsuarioDto {
    @ApiPropertyOptional({ description: 'Primeiro nome do usuário', example: 'João' })
    @IsOptional()
    @IsNotEmpty({ message: 'O primeiro nome não pode ser vazio.' })
    primeiroNome?: string;

    @ApiPropertyOptional({ description: 'Sobrenome do usuário', example: 'Silva' })
    @IsOptional()
    @IsNotEmpty({ message: 'O sobrenome não pode ser vazio.' })
    sobrenome?: string;

    @ApiPropertyOptional({ description: 'E-mail do usuário', example: 'joao@email.com' })
    @IsOptional()
    @IsEmail({}, { message: 'Formato de e-mail inválido.' })
    email?: string;

    @ApiPropertyOptional({ description: 'Status de ativação da conta', example: true })
    @IsOptional()
    @IsBoolean({ message: 'O campo ativo deve ser um booleano.' })
    ativo?: boolean;
}
