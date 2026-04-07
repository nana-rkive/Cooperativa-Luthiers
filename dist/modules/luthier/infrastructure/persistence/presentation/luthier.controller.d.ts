import { LuthierService } from '../application/luthier.service';
import { LuthierDto } from './dto/create-luthier.dto';
export declare class LuthierController {
    private readonly luthierService;
    constructor(luthierService: LuthierService);
    create(dto: LuthierDto): Promise<import("../domain/luthier").Luthier>;
    findAll(): Promise<import("../domain/luthier").Luthier[]>;
    findById(id: string): Promise<import("../domain/luthier").Luthier | null>;
    deactivate(id: string): Promise<import("../domain/luthier").Luthier>;
    delete(id: string): Promise<void>;
}
