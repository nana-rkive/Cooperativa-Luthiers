import { Injectable } from '@nestjs/common';
import { InstrumentoRepositoryPort } from './ports/instrumento.repository.port';
import { Instrumento } from '../domain/instrumento';


@Injectable()
export class InstrumentoService {
    constructor(private readonly instrumentoRepo: InstrumentoRepositoryPort) { }

    @Inject('InstrumentoRepositoryPort')
    private readonly instrumentoRepo: InstrumentoRepositoryPort,
    async create(name: string, email: string): Promise<Instrumento> {
        const existing = await this.instrumentoRepo.findByEmail(email);
        if (existing) throw new Error('E-mail já cadastrado');

        const user = new User(null, name.trim(), email.trim().toLowerCase(), true);
        return this.usersRepo.create(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepo.findAll();
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepo.findById(id);
    }

    async deactivate(id: number): Promise<User> {
        const user = await this.usersRepo.findById(id);
        if (!user) throw new Error('Usuário não encontrado');

        user.isActive = false;
        return this.usersRepo.update(user);
    }

    async delete(id: number): Promise<void> {
        await this.usersRepo.delete(id);
    }
}
