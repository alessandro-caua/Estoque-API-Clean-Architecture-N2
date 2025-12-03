// ============================================================================
// INTERFACE: ISALEREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de vendas.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF06: Registro de vendas
// - RF07: Baixa automática no estoque
// - RF08: Histórico de movimentações
// - RF09: Emissão de comprovantes
// - RF11: Vendas a prazo (fiado)
// ============================================================================

import { Sale, PaymentMethod, PaymentStatus } from '../entities/Sale';

/**
 * Filtros para busca de vendas
 */
export interface SaleFilters {
  /** Filtrar por cliente */
  clientId?: string;
  /** Filtrar por usuário (vendedor) */
  userId?: string;
  /** Filtrar por método de pagamento */
  paymentMethod?: PaymentMethod;
  /** Filtrar por status de pagamento */
  paymentStatus?: PaymentStatus;
  /** Data inicial do período */
  startDate?: Date;
  /** Data final do período */
  endDate?: Date;
  /** Valor mínimo */
  minTotal?: number;
  /** Valor máximo */
  maxTotal?: number;
}

/**
 * Resumo de vendas para relatórios
 */
export interface SalesSummary {
  /** Quantidade total de vendas */
  totalSales: number;
  /** Valor total das vendas */
  totalAmount: number;
  /** Valor médio por venda */
  averageTicket: number;
  /** Total de descontos concedidos */
  totalDiscount: number;
  /** Vendas por método de pagamento */
  byPaymentMethod: Record<string, { count: number; amount: number }>;
}

/**
 * Interface do repositório de Sale - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de vendas deve fornecer.
 */
export interface ISaleRepository {
  /**
   * Cria uma nova venda
   * @param sale - Entidade Sale a ser persistida (com itens)
   * @returns Promise com a venda criada (incluindo ID gerado)
   */
  create(sale: Sale): Promise<Sale>;

  /**
   * Busca uma venda pelo ID
   * @param id - Identificador único da venda
   * @returns Promise com a venda encontrada ou null (inclui itens)
   */
  findById(id: string): Promise<Sale | null>;

  /**
   * Lista todas as vendas com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de vendas
   */
  findAll(filters?: SaleFilters): Promise<Sale[]>;

  /**
   * Busca vendas de um cliente
   * @param clientId - ID do cliente
   * @returns Promise com array de vendas
   */
  findByClient(clientId: string): Promise<Sale[]>;

  /**
   * Busca vendas pendentes de um cliente (RF12)
   * @param clientId - ID do cliente
   * @returns Promise com array de vendas pendentes do cliente
   */
  findPendingByClient(clientId: string): Promise<Sale[]>;

  /**
   * Busca vendas em um período
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com array de vendas
   */
  findByPeriod(startDate: Date, endDate: Date): Promise<Sale[]>;

  /**
   * Busca vendas do dia atual
   * @returns Promise com array de vendas do dia
   */
  findToday(): Promise<Sale[]>;

  /**
   * Atualiza uma venda existente
   * @param id - ID da venda a atualizar
   * @param sale - Dados parciais para atualização
   * @returns Promise com a venda atualizada
   */
  update(id: string, sale: Partial<Sale>): Promise<Sale>;

  /**
   * Atualiza o status de pagamento de uma venda
   * @param id - ID da venda
   * @param status - Novo status de pagamento
   * @returns Promise com a venda atualizada
   */
  updatePaymentStatus(id: string, status: PaymentStatus): Promise<Sale>;

  /**
   * Cancela uma venda
   * @param id - ID da venda
   * @returns Promise com a venda cancelada
   */
  cancel(id: string): Promise<Sale>;

  /**
   * Remove uma venda
   * @param id - ID da venda a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Obtém resumo das vendas em um período
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com resumo das vendas
   */
  getSummary(startDate: Date, endDate: Date): Promise<SalesSummary>;

  /**
   * Conta o total de vendas
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: SaleFilters): Promise<number>;
}
