import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LuthierController } from './infrastructure/persistence/presentation/luthier.controller';
import { LuthierService } from './infrastructure/persistence/application/luthier.service';
import { LuthierOrmEntity } from './infrastructure/persistence/typeorm/luthier.orm-entity';
import { LuthierTypeOrmRepository } from './infrastructure/persistence/typeorm/luthier.typeorm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([LuthierOrmEntity])],
    controllers: [LuthierController],
    providers: [
        LuthierService,
        {
            provide: 'LuthierRepositoryPort',
            useClass: LuthierTypeOrmRepository,
        },
    ],
})
export class LuthierModule { }
