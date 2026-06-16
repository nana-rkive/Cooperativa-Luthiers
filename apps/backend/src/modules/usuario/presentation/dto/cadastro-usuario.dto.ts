import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CadastroUsuarioDto {
    @ApiProperty({ description: 'Primeiro nome do usuário', example: 'João' })
    @IsNotEmpty({ message: 'O primeiro nome é obrigatório.' })
    primeiroNome: string;

    @ApiProperty({ description: 'Sobrenome do usuário', example: 'Silva' })
    @IsNotEmpty({ message: 'O sobrenome é obrigatório.' })
    sobrenome: string;

    @ApiProperty({ description: 'E-mail do usuário', example: 'joao@email.com' })
    @IsEmail({}, { message: 'Formato de e-mail inválido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email: string;

    @ApiProperty({ description: 'Senha do usuário (mínimo 8 caracteres, pelo menos uma letra maiúscula)', example: 'Senha123' })
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    @Matches(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula.' })
    senha: string;
}
