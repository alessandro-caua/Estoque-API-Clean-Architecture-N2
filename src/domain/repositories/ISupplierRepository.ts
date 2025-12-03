// ============================================================================
// INTERFACE: ISUPPLIERREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de fornecedores.
// Segue o princípio de Inversão de Dependência (SOLID).
// ============================================================================

import { Supplier } from '../entities/Supplier';

/**
 * Interface do repositório de Supplier - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de fornecedores deve fornecer.
 */
export interface ISupplierRepository {
  /**
   * Cria um novo fornecedor
   * @param supplier - Entidade Supplier a ser persistida
   * @returns Promise com o fornecedor criado (incluindo ID gerado)
   */
  create(supplier: Supplier): Promise<Supplier>;

  /**
   * Busca um fornecedor pelo ID
   * @param id - Identificador único do fornecedor
   * @returns Promise com o fornecedor encontrado ou null
   */
  findById(id: string): Promise<Supplier | null>;

  /**
   * Busca um fornecedor pelo email
   * @param email - Email do fornecedor
   * @returns Promise com o fornecedor encontrado ou null
   */
  findByEmail(email: string): Promise<Supplier | null>;

  /**
   * Busca um fornecedor pelo CNPJ
   * @param cnpj - CNPJ do fornecedor
   * @returns Promise com o fornecedor encontrado ou null
   */
  findByCnpj(cnpj: string): Promise<Supplier | null>;

  /**
   * Lista todos os fornecedores
   * @returns Promise com array de fornecedores
   */
  findAll(): Promise<Supplier[]>;

  /**
   * Atualiza um fornecedor existente
   * @param id - ID do fornecedor a atualizar
   * @param supplier - Dados parciais para atualização
   * @returns Promise com o fornecedor atualizado
   */
  update(id: string, supplier: Partial<Supplier>): Promise<Supplier>;

  /**
   * Remove um fornecedor
   * @param id - ID do fornecedor a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;
}
