import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { LuthierService } from '../application/luthier.service';
import { LuthierDto } from './dto/create-luthier.dto';

@ApiTags('Luthiers')
@Controller('luthiers')
export class LuthierController {
    constructor(private readonly luthierService: LuthierService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um luthier' })
    create(@Body() dto: LuthierDto) {
        return this.luthierService.create(dto.nomeMestre, dto.dataAbertura, dto.certificada, dto.bancadasNum);
    }

    @Get()
    @ApiOperation({ summary: 'Lista luthiers' })
    findAll() {
        return this.luthierService.findAll();
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Busca luthier por id' })
    findById(@Param('id') id: string) {
        return this.luthierService.findById(Number(id));
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Desativa um luthier' })
    deactivate(@Param('id') id: string) {
        return this.luthierService.deactivate(Number(id));
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um luthier' })
    delete(@Param('id') id: string) {
        return this.luthierService.delete(Number(id));
    }
}