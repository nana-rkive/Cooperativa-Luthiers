import { Usuario } from '../../domain/usuario';

export interface UsuarioRepositoryPort {
    create(usuario: Usuario): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findByEmail(email: string): Promise<Usuario | null>;
    findById(id: number): Promise<Usuario | null>;
    findByTokenAtivacao(token: string): Promise<Usuario | null>;
    update(usuario: Usuario): Promise<Usuario>;
    delete(id: number): Promise<void>;
}
