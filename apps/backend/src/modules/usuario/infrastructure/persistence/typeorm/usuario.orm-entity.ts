import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import type { UsuarioRole } from '../../../domain/usuario';

@Entity('usuario')
export class UsuarioOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  primeiroNome: string;

  @Column()
  sobrenome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ default: false })
  ativo: boolean;

  @Column({ default: 'luthier' })
  role: UsuarioRole;

  @Column({ nullable: true, type: 'varchar' })
  tokenAtivacao: string | null;
}
