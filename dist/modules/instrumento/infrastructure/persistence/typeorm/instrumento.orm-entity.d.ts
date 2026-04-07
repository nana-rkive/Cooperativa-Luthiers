import { LuthierOrmEntity } from '../../../../luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
export declare class InstrumentoOrmEntity {
    id: number;
    modeloMadeira: string;
    dataEntrada: Date;
    reparoConcluido: boolean;
    custoReparo: number;
    luthier: LuthierOrmEntity;
}
