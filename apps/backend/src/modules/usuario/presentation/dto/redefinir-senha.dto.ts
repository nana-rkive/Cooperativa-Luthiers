import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RedefinirSenhaDto {
  @ApiProperty({ description: 'E-mail do usuário', example: 'joao@email.com' })
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @ApiProperty({ description: 'Nova senha', example: 'NovaSenha123' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória.' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
  @Matches(/[A-Z]/, {
    message: 'A nova senha deve conter pelo menos uma letra maiúscula.',
  })
  novaSenha: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'NovaSenha123',
  })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória.' })
  confirmarNovaSenha: string;
}
