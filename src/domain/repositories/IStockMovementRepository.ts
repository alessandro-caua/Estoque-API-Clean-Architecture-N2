// ============================================================================
// INTERFACE: ISTOCKMOVEMENTREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de movimentações de estoque.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF06: Registro de entrada de produtos
// - RF07: Registro de saída de produtos (vendas)
// - RF08: Consulta de histórico de movimentações
// - RF18: Relatório de entradas e saídas
// ============================================================================

import { StockMovement, MovementType } from '../entities/StockMovement';

/**
 * Filtros para busca de movimentações
 */
export interface StockMovementFilters {
  /** Filtrar por produto */
  productId?: string;
  /** Filtrar por tipo de movimentação */
  type?: MovementType;
  /** Data inicial do período */
  startDate?: Date;
  /** Data final do período */
  endDate?: Date;
}

/**
 * Interface do repositório de StockMovement - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de movimentações de estoque deve fornecer.
 */
export interface IStockMovementRepository {
  /**
   * Cria uma nova movimentação de estoque
   * @param movement - Entidade StockMovement a ser persistida
   * @returns Promise com a movimentação criada (incluindo ID gerado)
   */
  create(movement: StockMovement): Promise<StockMovement>;

  /**
   * Busca uma movimentação pelo ID
   * @param id - Identificador único da movimentação
   * @returns Promise com a movimentação encontrada ou null
   */
  findById(id: string): Promise<StockMovement | null>;

  /**
   * Lista todas as movimentações com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de movimentações
   */
  findAll(filters?: StockMovementFilters): Promise<StockMovement[]>;

  /**
   * Busca movimentações de um produto específico
   * @param productId - ID do produto
   * @returns Promise com array de movimentações
   */
  findByProductId(productId: string): Promise<StockMovement[]>;

  /**
   * Busca movimentações por tipo
   * @param type - Tipo de movimentação
   * @returns Promise com array de movimentações
   */
  findByType(type: MovementType): Promise<StockMovement[]>;

  /**
   * Busca movimentações em um período
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com array de movimentações
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<StockMovement[]>;

  /**
   * Remove uma movimentação
   * @param id - ID da movimentação a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;
}
