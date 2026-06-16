import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
