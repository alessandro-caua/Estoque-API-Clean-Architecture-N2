// Interface do repositório de Supplier - Camada de Domínio
import { Supplier } from '../entities/Supplier';

export interface ISupplierRepository {
  create(supplier: Supplier): Promise<Supplier>;
  findById(id: string): Promise<Supplier | null>;
  findByEmail(email: string): Promise<Supplier | null>;
  findByCnpj(cnpj: string): Promise<Supplier | null>;
  findAll(): Promise<Supplier[]>;
  update(id: string, supplier: Partial<Supplier>): Promise<Supplier>;
  delete(id: string): Promise<void>;
}
