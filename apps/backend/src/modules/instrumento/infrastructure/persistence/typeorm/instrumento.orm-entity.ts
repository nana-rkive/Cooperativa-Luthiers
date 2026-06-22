import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LuthierOrmEntity } from '../../../../luthier/infrastructure/persistence/typeorm/luthier.orm-entity';

@Entity('instrumento_reparo')
export class InstrumentoOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modeloMadeira: string;

  @Column({ type: 'date' })
  dataEntrada: Date;

  @Column({ default: false })
  reparoConcluido: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  custoReparo: number;

  @ManyToOne(() => LuthierOrmEntity, (luthier) => luthier.instrumentos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'luthierId' }) // Chave Estrangeira
  luthier: LuthierOrmEntity;

  @Column()
  luthierId: number;
}
