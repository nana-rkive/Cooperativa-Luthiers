import { InstrumentoService } from '../../application/instrumento.service';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
export declare class InstrumentoController {
    private readonly instrumentoService;
    constructor(instrumentoService: InstrumentoService);
    create(dto: CreateInstrumentoDto): Promise<import("../../domain/instrumento").Instrumento>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<any>;
    deactivate(id: string): Promise<User>;
    delete(id: string): Promise<void>;
}
