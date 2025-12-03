// Use Cases de Supplier - Camada de Aplicação
import { Supplier } from '../../domain/entities/Supplier';
import { ISupplierRepository } from '../../domain/repositories/ISupplierRepository';

// DTOs
export interface CreateSupplierDTO {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  cnpj?: string;
}

export interface UpdateSupplierDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  cnpj?: string;
}

// Create Supplier Use Case
export class CreateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(data: CreateSupplierDTO): Promise<Supplier> {
    if (data.email) {
      const existingByEmail = await this.supplierRepository.findByEmail(data.email);
      if (existingByEmail) {
        throw new Error('Já existe um fornecedor com este email');
      }
    }

    if (data.cnpj) {
      const existingByCnpj = await this.supplierRepository.findByCnpj(data.cnpj);
      if (existingByCnpj) {
        throw new Error('Já existe um fornecedor com este CNPJ');
      }
    }

    const supplier = new Supplier({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      cnpj: data.cnpj,
    });

    return this.supplierRepository.create(supplier);
  }
}

// Get Supplier By Id Use Case
export class GetSupplierByIdUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: string): Promise<Supplier | null> {
    return this.supplierRepository.findById(id);
  }
}

// Get All Suppliers Use Case
export class GetAllSuppliersUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(): Promise<Supplier[]> {
    return this.supplierRepository.findAll();
  }
}

// Update Supplier Use Case
export class UpdateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: string, data: UpdateSupplierDTO): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new Error('Fornecedor não encontrado');
    }

    if (data.email) {
      const supplierWithSameEmail = await this.supplierRepository.findByEmail(data.email);
      if (supplierWithSameEmail && supplierWithSameEmail.id !== id) {
        throw new Error('Já existe um fornecedor com este email');
      }
    }

    if (data.cnpj) {
      const supplierWithSameCnpj = await this.supplierRepository.findByCnpj(data.cnpj);
      if (supplierWithSameCnpj && supplierWithSameCnpj.id !== id) {
        throw new Error('Já existe um fornecedor com este CNPJ');
      }
    }

    return this.supplierRepository.update(id, data);
  }
}

// Delete Supplier Use Case
export class DeleteSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: string): Promise<void> {
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new Error('Fornecedor não encontrado');
    }

    return this.supplierRepository.delete(id);
  }
}
