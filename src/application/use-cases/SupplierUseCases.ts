// ============================================================================
// USE CASES: SUPPLIER (FORNECEDOR)
// ============================================================================
// Casos de uso para operações com fornecedores.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// CONCEITO: Validação de Unicidade
// ================================
// Antes de criar/atualizar, verificamos se campos únicos (email, CNPJ)
// já existem no banco. Isso evita duplicatas e garante integridade.
// 
// Requisitos atendidos:
// - RF03: Cadastro de fornecedores
// - RF04: Gestão de dados de contato
// ============================================================================

import { Supplier } from '../../domain/entities/Supplier';
import { ISupplierRepository } from '../../domain/repositories/ISupplierRepository';

// Importando DTOs da pasta centralizada
import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos';

// Importando erros de domínio específicos
import { 
  EntityNotFoundError, 
  EntityAlreadyExistsError 
} from '../../domain/errors';

// Re-exportando DTOs para manter compatibilidade
export { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos';

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Fornecedor
 * @description Cria um novo fornecedor validando unicidade de email e CNPJ
 */
export class CreateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(data: CreateSupplierDTO): Promise<Supplier> {
    // Verifica duplicidade de email
    if (data.email) {
      const existingByEmail = await this.supplierRepository.findByEmail(data.email);
      if (existingByEmail) {
        throw new EntityAlreadyExistsError('Fornecedor', 'email', data.email);
      }
    }

    // Verifica duplicidade de CNPJ
    if (data.cnpj) {
      const existingByCnpj = await this.supplierRepository.findByCnpj(data.cnpj);
      if (existingByCnpj) {
        throw new EntityAlreadyExistsError('Fornecedor', 'CNPJ', data.cnpj);
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

/**
 * Caso de Uso: Buscar Fornecedor por ID
 * @description Busca um fornecedor específico pelo identificador
 */
export class GetSupplierByIdUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: string): Promise<Supplier | null> {
    return this.supplierRepository.findById(id);
  }
}

/**
 * Caso de Uso: Listar Todos os Fornecedores
 * @description Retorna todos os fornecedores cadastrados
 */
export class GetAllSuppliersUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(): Promise<Supplier[]> {
    return this.supplierRepository.findAll();
  }
}

/**
 * Caso de Uso: Atualizar Fornecedor
 * @description Atualiza os dados de um fornecedor existente
 */
export class UpdateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: string, data: UpdateSupplierDTO): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new EntityNotFoundError('Fornecedor', id);
    }

    // Verifica duplicidade de email
    if (data.email) {
      const supplierWithSameEmail = await this.supplierRepository.findByEmail(data.email);
      if (supplierWithSameEmail && supplierWithSameEmail.id !== id) {
        throw new EntityAlreadyExistsError('Fornecedor', 'email', data.email);
      }
    }

    // Verifica duplicidade de CNPJ
    if (data.cnpj) {
      const supplierWithSameCnpj = await this.supplierRepository.findByCnpj(data.cnpj);
      if (supplierWithSameCnpj && supplierWithSameCnpj.id !== id) {
        throw new EntityAlreadyExistsError('Fornecedor', 'CNPJ', data.cnpj);
      }
    }

    return this.supplierRepository.update(id, data);
  }
}

/**
 * Caso de Uso: Excluir Fornecedor
 * @description Remove um fornecedor do sistema
 */
export class DeleteSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: string): Promise<void> {
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new EntityNotFoundError('Fornecedor', id);
    }

    return this.supplierRepository.delete(id);
  }
}
