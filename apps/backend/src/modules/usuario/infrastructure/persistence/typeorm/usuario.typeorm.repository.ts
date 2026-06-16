import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioRepositoryPort } from '../../../application/ports/usuario.repository.port';
import { Usuario } from '../../../domain/usuario';
import { UsuarioOrmEntity } from './usuario.orm-entity';

@Injectable()
export class UsuarioTypeOrmRepository implements UsuarioRepositoryPort {
    constructor(
        @InjectRepository(UsuarioOrmEntity)
        private readonly repo: Repository<UsuarioOrmEntity>,
    ) { }

    async create(usuario: Usuario): Promise<Usuario> {
        const orm = this.repo.create({
            primeiroNome: usuario.primeiroNome,
            sobrenome: usuario.sobrenome,
            email: usuario.email,
            senha: usuario.senha,
            ativo: usuario.ativo,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findAll(): Promise<Usuario[]> {
        const items = await this.repo.find({ order: { id: 'ASC' } });
        return items.map(this.toDomain);
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        const found = await this.repo.findOneBy({ email });
        return found ? this.toDomain(found) : null;
    }

    async findById(id: number): Promise<Usuario | null> {
        const found = await this.repo.findOneBy({ id });
        return found ? this.toDomain(found) : null;
    }

    async update(usuario: Usuario): Promise<Usuario> {
        const orm = await this.repo.findOneBy({ id: usuario.id! });
        if (!orm) throw new Error('Usuário não encontrado');

        orm.primeiroNome = usuario.primeiroNome;
        orm.sobrenome = usuario.sobrenome;
        orm.email = usuario.email;
        orm.senha = usuario.senha;
        orm.ativo = usuario.ativo;

        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete({ id });
    }

    private toDomain = (orm: UsuarioOrmEntity): Usuario => {
        return new Usuario(orm.id, orm.primeiroNome, orm.sobrenome, orm.email, orm.senha, orm.ativo);
    };
}
