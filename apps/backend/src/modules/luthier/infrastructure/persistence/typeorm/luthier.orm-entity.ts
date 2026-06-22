import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InstrumentoOrmEntity } from '../../../../instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity';

@Entity('luthier')
export class LuthierOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeMestre: string; // Ex: "João Silva"

  @Column({ type: 'date' })
  dataAbertura: Date; // Data de abertura da oficina

  @Column()
  certificada: boolean; // Oficina certificada?

  @Column()
  bancadasNum: number; // Mínimo 2 bancadas

  @OneToMany(() => InstrumentoOrmEntity, (instrumento) => instrumento.luthier)
  instrumentos: InstrumentoOrmEntity[]; // Relacionamento 1:N
}
