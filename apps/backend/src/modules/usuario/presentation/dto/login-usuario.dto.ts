import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUsuarioDto {
    @ApiProperty({ description: 'E-mail do usuário', example: 'joao@email.com' })
    @IsEmail({}, { message: 'Formato de e-mail inválido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email: string;

    @ApiProperty({ description: 'Senha do usuário', example: 'Senha123' })
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    senha: string;
}
