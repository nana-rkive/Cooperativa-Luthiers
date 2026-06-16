import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UsuarioService } from '../application/usuario.service';
import { CadastroUsuarioDto } from './dto/cadastro-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ValidarEmailDto } from './dto/validar-email.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// ─── Autenticação ─────────────────────────────────────────────────────────────

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private readonly usuarioService: UsuarioService) { }

    @Post('cadastro')
    @ApiOperation({ summary: 'Cadastra um novo usuário (conta inicia aguardando ativação)' })
    @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso. Aguardando ativação.' })
    @ApiResponse({ status: 409, description: 'E-mail já cadastrado — redirecionar para login.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos (campo obrigatório ausente, senha fraca, e-mail inválido).' })
    async cadastro(@Body() dto: CadastroUsuarioDto) {
        return this.usuarioService.cadastro(
            dto.primeiroNome,
            dto.sobrenome,
            dto.email,
            dto.senha,
        );
    }

    @Post('login')
    @ApiOperation({ summary: 'Realiza o login validando credenciais contra o banco de dados' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
    @ApiResponse({ status: 400, description: 'E-mail não cadastrado (faça seu cadastro) ou senha incorreta.' })
    async login(@Body() dto: LoginUsuarioDto) {
        return this.usuarioService.login(dto.email, dto.senha);
    }

    @Post('recuperar-senha/validar-email')
    @ApiOperation({ summary: 'Passo 1 da recuperação: valida se o e-mail existe no banco de dados' })
    @ApiResponse({ status: 200, description: 'E-mail válido — prosseguir para redefinição de senha.' })
    @ApiResponse({ status: 400, description: 'E-mail não cadastrado.' })
    async validarEmail(@Body() dto: ValidarEmailDto) {
        return this.usuarioService.validarEmail(dto.email);
    }

    @Post('recuperar-senha/redefinir')
    @ApiOperation({ summary: 'Passo 2 da recuperação: redefine a senha (os dois campos devem ser idênticos)' })
    @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso.' })
    @ApiResponse({ status: 400, description: 'As senhas não coincidem, e-mail não cadastrado ou senha fraca.' })
    async redefinirSenha(@Body() dto: RedefinirSenhaDto) {
        return this.usuarioService.redefinirSenha(
            dto.email,
            dto.novaSenha,
            dto.confirmarNovaSenha,
        );
    }
}

// ─── CRUD de Usuários ─────────────────────────────────────────────────────────

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) { }

    @Get()
    @ApiOperation({ summary: 'Lista todos os usuários cadastrados' })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
    findAll() {
        return this.usuarioService.findAll();
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Busca um usuário pelo ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    findById(@Param('id') id: string) {
        return this.usuarioService.findById(Number(id));
    }

    @Put(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Atualiza os dados de um usuário (nome, sobrenome, e-mail, status de ativação)' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    @ApiResponse({ status: 409, description: 'Novo e-mail já está em uso por outro usuário.' })
    atualizar(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
        return this.usuarioService.atualizar(Number(id), {
            primeiroNome: dto.primeiroNome,
            sobrenome: dto.sobrenome,
            email: dto.email,
            ativo: dto.ativo,
        });
    }

    @Delete(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Remove um usuário pelo ID' })
    @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    deletar(@Param('id') id: string) {
        return this.usuarioService.deletar(Number(id));
    }
}
