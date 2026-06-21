import { Body, Controller, Delete, Get, Param, Post, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LuthierService } from '../application/luthier.service';
import { CreateLuthierDto } from './dto/create-luthier.dto';
import { JwtAuthGuard } from '../../usuario/infrastructure/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/guards/roles.decorator';

@ApiTags('Luthiers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('luthiers')
export class LuthierController {
    constructor(private readonly luthierService: LuthierService) { }

    @Post()
    @Roles('admin')
    @ApiOperation({ summary: 'Cria um luthier' })
    @ApiResponse({ status: 201, description: 'Luthier criado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 403, description: 'Sem permissão — requer role admin.' })
    create(@Body() dto: CreateLuthierDto) {
        return this.luthierService.create(dto.nomeMestre, dto.dataAbertura, dto.certificada, dto.bancadasNum);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os luthiers' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    findAll() {
        return this.luthierService.findAll();
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Busca luthier por id' })
    @ApiResponse({ status: 200, description: 'Luthier encontrado.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 404, description: 'Luthier não encontrado.' })
    findById(@Param('id') id: string) {
        return this.luthierService.findById(Number(id));
    }

    @Get(':id/com-instrumentos')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Busca luthier com todos os seus instrumentos em reparo' })
    @ApiResponse({ status: 200, description: 'Luthier com instrumentos retornado.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    findWithInstrumentos(@Param('id') id: string) {
        return this.luthierService.findWithInstrumentos(Number(id));
    }

    @Put(':id')
    @Roles('admin')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Atualiza os dados de um luthier' })
    @ApiResponse({ status: 200, description: 'Luthier atualizado.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 403, description: 'Sem permissão — requer role admin.' })
    update(@Param('id') id: string, @Body() dto: CreateLuthierDto) {
        return this.luthierService.update(Number(id), dto.nomeMestre, dto.dataAbertura, dto.certificada, dto.bancadasNum);
    }

    @Patch(':id/deactivate')
    @Roles('admin')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Desativa a certificação de um luthier' })
    @ApiResponse({ status: 200, description: 'Certificação desativada.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 403, description: 'Sem permissão — requer role admin.' })
    deactivate(@Param('id') id: string) {
        return this.luthierService.deactivate(Number(id));
    }

    @Delete(':id')
    @Roles('admin')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Remove um luthier' })
    @ApiResponse({ status: 200, description: 'Luthier removido com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    @ApiResponse({ status: 403, description: 'Sem permissão — requer role admin.' })
    delete(@Param('id') id: string) {
        return this.luthierService.delete(Number(id));
    }
}
