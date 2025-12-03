// ============================================================================
// INTERFACE: ICATEGORYREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de categorias.
// Segue o princípio de Inversão de Dependência (SOLID).
// A implementação concreta fica na camada de infraestrutura.
// ============================================================================

import { Category } from '../entities/Category';

/**
 * Interface do repositório de Category - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de categorias deve fornecer.
 */
export interface ICategoryRepository {
  /**
   * Cria uma nova categoria
   * @param category - Entidade Category a ser persistida
   * @returns Promise com a categoria criada (incluindo ID gerado)
   */
  create(category: Category): Promise<Category>;

  /**
   * Busca uma categoria pelo ID
   * @param id - Identificador único da categoria
   * @returns Promise com a categoria encontrada ou null
   */
  findById(id: string): Promise<Category | null>;

  /**
   * Busca uma categoria pelo nome
   * @param name - Nome da categoria
   * @returns Promise com a categoria encontrada ou null
   */
  findByName(name: string): Promise<Category | null>;

  /**
   * Lista todas as categorias
   * @returns Promise com array de categorias
   */
  findAll(): Promise<Category[]>;

  /**
   * Atualiza uma categoria existente
   * @param id - ID da categoria a atualizar
   * @param category - Dados parciais para atualização
   * @returns Promise com a categoria atualizada
   */
  update(id: string, category: Partial<Category>): Promise<Category>;

  /**
   * Remove uma categoria
   * @param id - ID da categoria a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;
}
