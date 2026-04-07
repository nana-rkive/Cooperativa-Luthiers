import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LuthierOrmEntity } from '../../../../luthier/infrastructure/persistence/typeorm/luthier.orm-entity';

@Entity('instrumento_reparo')
export class InstrumentoOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    modeloMadeira: string; // Ex: "Violino Stradivarius"[cite: 1]

    @Column({ type: 'date' })
    dataEntrada: Date;

    @Column()
    reparoConcluido: boolean;

    @Column({ type: 'decimal' })
    custoReparo: number;

    @ManyToOne(() => LuthierOrmEntity, (luthier) => luthier.instrumentos)
    @JoinColumn({ name: 'luthierId' }) // Chave Estrangeira[cite: 1]
    luthier: LuthierOrmEntity;
}