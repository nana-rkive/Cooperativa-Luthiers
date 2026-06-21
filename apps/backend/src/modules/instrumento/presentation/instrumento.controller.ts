import { Body, Controller, Delete, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InstrumentoService } from '../application/instrumento.service';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
import { JwtAuthGuard } from '../../usuario/infrastructure/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/guards/roles.decorator';

@ApiTags('Instrumentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('instrumentos')
export class InstrumentoController {
    constructor(private readonly instrumentoService: InstrumentoService) { }

    @Post()
    @Roles('admin', 'luthier')
    @ApiOperation({ summary: 'Registre a entrada de um instrumento na oficina para reparo' })
    @ApiBody({ type: CreateInstrumentoDto })
    @ApiResponse({ status: 201, description: 'Instrumento registrado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 403, description: 'Sem permissão.' })
    create(@Body() dto: CreateInstrumentoDto) {
        return this.instrumentoService.create(dto.modeloMadeira, dto.dataEntrada, dto.reparoConcluido, dto.custoReparo, dto.luthierId);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os instrumentos em manutenção na oficina' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    findAll() {
        return this.instrumentoService.findAll();
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 1, description: 'ID do instrumento' })
    @ApiOperation({ summary: 'Busca instrumento por id' })
    @ApiResponse({ status: 200, description: 'Instrumento encontrado.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 404, description: 'Instrumento não encontrado.' })
    findById(@Param('id') id: string) {
        return this.instrumentoService.findById(Number(id));
    }

    @Patch(':id/concluir')
    @Roles('admin', 'luthier')
    @ApiParam({ name: 'id', example: 1, description: 'ID do instrumento' })
    @ApiOperation({ summary: 'Marca o reparo de um instrumento como concluído' })
    @ApiResponse({ status: 200, description: 'Reparo marcado como concluído.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 403, description: 'Sem permissão.' })
    deactivate(@Param('id') id: string) {
        return this.instrumentoService.deactivate(Number(id));
    }

    @Delete(':id')
    @Roles('admin')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Remove o registro de um instrumento' })
    @ApiResponse({ status: 200, description: 'Instrumento removido com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 403, description: 'Sem permissão — requer role admin.' })
    delete(@Param('id') id: string) {
        return this.instrumentoService.delete(Number(id));
    }
}