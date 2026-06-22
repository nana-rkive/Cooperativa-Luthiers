import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsuarioService } from '../application/usuario.service';
import { CadastroUsuarioDto } from './dto/cadastro-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ValidarEmailDto } from './dto/validar-email.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../infrastructure/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/guards/roles.decorator';

// ─── Autenticação (rotas públicas) ────────────────────────────────────────────

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('register')
  @ApiOperation({
    summary:
      'Registra um novo usuário (conta criada inativa, aguarda ativação via token)',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado. Aguardando ativação.',
  })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async register(@Body() dto: CadastroUsuarioDto) {
    return this.usuarioService.cadastro(
      dto.primeiroNome,
      dto.sobrenome,
      dto.email,
      dto.senha,
    );
  }

  /** @deprecated — mantido por retrocompatibilidade. Use POST /auth/register */
  @Post('cadastro')
  @ApiOperation({
    summary: '[Legado] Alias de /auth/register. Prefira usar /auth/register.',
    deprecated: true,
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso.' })
  async cadastro(@Body() dto: CadastroUsuarioDto) {
    return this.usuarioService.cadastro(
      dto.primeiroNome,
      dto.sobrenome,
      dto.email,
      dto.senha,
    );
  }

  @Get('ativar/:token')
  @ApiOperation({
    summary: 'Ativa a conta do usuário via token recebido por e-mail',
  })
  @ApiParam({
    name: 'token',
    description: 'UUID de ativação enviado ao e-mail do usuário',
  })
  @ApiResponse({ status: 200, description: 'Conta ativada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado.' })
  @ApiResponse({
    status: 409,
    description: 'Conta já foi ativada anteriormente.',
  })
  async ativarConta(@Param('token') token: string) {
    return this.usuarioService.ativarConta(token);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Autentica o usuário e retorna um JWT (Bearer Token)',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado. Retorna accessToken + dados do usuário.',
  })
  @ApiResponse({
    status: 400,
    description: 'E-mail não cadastrado ou senha incorreta.',
  })
  @ApiResponse({ status: 403, description: 'Conta aguardando ativação.' })
  async login(@Body() dto: LoginUsuarioDto) {
    return this.usuarioService.login(dto.email, dto.senha);
  }

  @Post('recuperar-senha/validar-email')
  @ApiOperation({
    summary: 'Passo 1 da recuperação: valida se o e-mail existe no banco',
  })
  @ApiResponse({ status: 200, description: 'E-mail válido.' })
  @ApiResponse({ status: 400, description: 'E-mail não cadastrado.' })
  async validarEmail(@Body() dto: ValidarEmailDto) {
    return this.usuarioService.validarEmail(dto.email);
  }

  @Post('recuperar-senha/redefinir')
  @ApiOperation({ summary: 'Passo 2 da recuperação: redefine a senha' })
  @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Senhas não coincidem ou e-mail inválido.',
  })
  async redefinirSenha(@Body() dto: RedefinirSenhaDto) {
    return this.usuarioService.redefinirSenha(
      dto.email,
      dto.novaSenha,
      dto.confirmarNovaSenha,
    );
  }
}

// ─── CRUD de Usuários (protegido — apenas admin) ──────────────────────────────

@ApiTags('Usuários')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lista todos os usuários cadastrados' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão — requer role admin.',
  })
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', example: 1 })
  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão — requer role admin.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findById(@Param('id') id: string) {
    return this.usuarioService.findById(Number(id));
  }

  @Put(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', example: 1 })
  @ApiOperation({ summary: 'Atualiza os dados de um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão — requer role admin.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'Novo e-mail já está em uso.' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.atualizar(Number(id), {
      primeiroNome: dto.primeiroNome,
      sobrenome: dto.sobrenome,
      email: dto.email,
      ativo: dto.ativo,
    });
  }

  @Delete(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', example: 1 })
  @ApiOperation({ summary: 'Remove um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão — requer role admin.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  deletar(@Param('id') id: string) {
    return this.usuarioService.deletar(Number(id));
  }
}
