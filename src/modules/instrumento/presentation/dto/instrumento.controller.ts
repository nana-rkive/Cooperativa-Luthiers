import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { InstrumentoService } from '../../application/instrumento.service';
import { CreateInstrumentoDto } from './create-instrumento.dto';

@ApiTags('Instrumentos')
@Controller('instrumentos')
export class InstrumentoController {
    constructor(private readonly instrumentoService: InstrumentoService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um usuário' })
    create(@Body() dto: CreateInstrumentoDto) {
        return this.instrumentoService.create(dto.modeloMadeira, dto.dataEntrada, dto.reparoConcluido, dto.custoReparo, dto.luthierId);
    }

    @Get()
    @ApiOperation({ summary: 'Lista usuários' })
    findAll() {
        return this.instrumentoService.findAll();
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Busca usuário por id' })
    findById(@Param('id') id: string) {
        return this.instrumentoService.findById(Number(id));
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Desativa um usuário' })
    deactivate(@Param('id') id: string) {
        return this.instrumentoService.deactivate(Number(id));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um usuário' })
    delete(@Param('id') id: string) {
        return this.instrumentoService.delete(Number(id));
    }
}