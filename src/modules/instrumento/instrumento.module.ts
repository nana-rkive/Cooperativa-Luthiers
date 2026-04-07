import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentoController } from './presentation/instrumento.controller';
import { InstrumentoService } from './application/instrumento.service';
import { InstrumentoOrmEntity } from './infrastructure/persistence/typeorm/instrumento.orm-entity';
import { InstrumentoTypeOrmRepository } from './infrastructure/persistence/typeorm/instrumento.typeorm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([InstrumentoOrmEntity])],
    controllers: [InstrumentoController],
    providers: [
        InstrumentoService,
        {
            provide: 'InstrumentoRepositoryPort',
            useClass: InstrumentoTypeOrmRepository,
        },
    ],
})
export class InstrumentoModule { }
