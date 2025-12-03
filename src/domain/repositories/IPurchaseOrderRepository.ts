// ============================================================================
// INTERFACE: IPURCHASEORDERREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de pedidos de compra.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF14: Registro de pedidos de compra a fornecedores
// - RF06: Registro de entrada de produtos (ao receber)
// ============================================================================

import { PurchaseOrder, PurchaseOrderStatus } from '../entities/PurchaseOrder';

/**
 * Filtros para busca de pedidos de compra
 */
export interface PurchaseOrderFilters {
  /** Filtrar por fornecedor */
  supplierId?: string;
  /** Filtrar por status */
  status?: PurchaseOrderStatus;
  /** Data inicial do período */
  startDate?: Date;
  /** Data final do período */
  endDate?: Date;
}

/**
 * Interface do repositório de PurchaseOrder - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de pedidos de compra deve fornecer.
 */
export interface IPurchaseOrderRepository {
  /**
   * Cria um novo pedido de compra
   * @param order - Entidade PurchaseOrder a ser persistida (com itens)
   * @returns Promise com o pedido criado (incluindo ID gerado)
   */
  create(order: PurchaseOrder): Promise<PurchaseOrder>;

  /**
   * Busca um pedido pelo ID
   * @param id - Identificador único do pedido
   * @returns Promise com o pedido encontrado ou null (inclui itens)
   */
  findById(id: string): Promise<PurchaseOrder | null>;

  /**
   * Lista todos os pedidos com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de pedidos
   */
  findAll(filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]>;

  /**
   * Busca pedidos de um fornecedor
   * @param supplierId - ID do fornecedor
   * @returns Promise com array de pedidos
   */
  findBySupplier(supplierId: string): Promise<PurchaseOrder[]>;

  /**
   * Busca pedidos por status
   * @param status - Status do pedido
   * @returns Promise com array de pedidos
   */
  findByStatus(status: PurchaseOrderStatus): Promise<PurchaseOrder[]>;

  /**
   * Busca pedidos pendentes
   * @returns Promise com array de pedidos pendentes
   */
  findPending(): Promise<PurchaseOrder[]>;

  /**
   * Busca pedidos por período
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com array de pedidos
   */
  findByPeriod(startDate: Date, endDate: Date): Promise<PurchaseOrder[]>;

  /**
   * Atualiza um pedido existente
   * @param id - ID do pedido a atualizar
   * @param order - Dados parciais para atualização
   * @returns Promise com o pedido atualizado
   */
  update(id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder>;

  /**
   * Atualiza o status do pedido
   * @param id - ID do pedido
   * @param status - Novo status
   * @returns Promise com o pedido atualizado
   */
  updateStatus(id: string, status: PurchaseOrderStatus): Promise<PurchaseOrder>;

  /**
   * Marca pedido como recebido
   * @param id - ID do pedido
   * @param receivedDate - Data de recebimento
   * @returns Promise com o pedido atualizado
   */
  receive(id: string, receivedDate: Date): Promise<PurchaseOrder>;

  /**
   * Cancela um pedido
   * @param id - ID do pedido
   * @returns Promise com o pedido cancelado
   */
  cancel(id: string): Promise<PurchaseOrder>;

  /**
   * Remove um pedido
   * @param id - ID do pedido a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Conta o total de pedidos
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: PurchaseOrderFilters): Promise<number>;
}
