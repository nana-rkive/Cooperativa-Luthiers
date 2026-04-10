import { InstrumentoService } from '../../application/instrumento.service';
import { CreateInstrumentoDto } from './create-instrumento.dto';
export declare class InstrumentoController {
    private readonly instrumentoService;
    constructor(instrumentoService: InstrumentoService);
    create(dto: CreateInstrumentoDto): Promise<import("../../domain/instrumento").Instrumento>;
    findAll(): Promise<import("../../domain/instrumento").Instrumento[]>;
    findById(id: string): Promise<import("../../domain/instrumento").Instrumento | null>;
    deactivate(id: string): Promise<import("../../domain/instrumento").Instrumento>;
    delete(id: string): Promise<void>;
}
