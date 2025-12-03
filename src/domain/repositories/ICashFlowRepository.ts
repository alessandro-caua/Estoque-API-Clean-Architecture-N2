// ============================================================================
// INTERFACE: ICASHFLOWREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de fluxo de caixa.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF15: Controle de contas a pagar
// - RF16: Controle de contas a receber  
// - RF17: Relatório de fluxo de caixa
// ============================================================================

import { CashFlow, CashFlowType, CashFlowCategory } from '../entities/CashFlow';

/**
 * Filtros para busca de movimentações de caixa
 */
export interface CashFlowFilters {
  /** Filtrar por tipo (entrada/saída) */
  type?: CashFlowType;
  /** Filtrar por categoria */
  category?: CashFlowCategory;
  /** Data inicial do período */
  startDate?: Date;
  /** Data final do período */
  endDate?: Date;
  /** Filtrar por venda relacionada */
  saleId?: string;
  /** Filtrar por conta financeira relacionada */
  accountId?: string;
  /** Busca textual por descrição */
  search?: string;
}

/**
 * Resumo do fluxo de caixa para relatórios
 */
export interface CashFlowSummary {
  /** Total de entradas no período */
  totalInflows: number;
  /** Total de saídas no período */
  totalOutflows: number;
  /** Saldo do período (entradas - saídas) */
  balance: number;
  /** Quantidade de movimentações */
  transactionCount: number;
  /** Entradas por categoria */
  inflowsByCategory: Record<CashFlowCategory, number>;
  /** Saídas por categoria */
  outflowsByCategory: Record<CashFlowCategory, number>;
}

/**
 * Interface do repositório de CashFlow - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de fluxo de caixa deve fornecer.
 */
export interface ICashFlowRepository {
  /**
   * Cria uma nova movimentação de caixa
   * @param cashFlow - Entidade CashFlow a ser persistida
   * @returns Promise com a movimentação criada (incluindo ID gerado)
   */
  create(cashFlow: CashFlow): Promise<CashFlow>;

  /**
   * Busca uma movimentação pelo ID
   * @param id - Identificador único da movimentação
   * @returns Promise com a movimentação encontrada ou null
   */
  findById(id: string): Promise<CashFlow | null>;

  /**
   * Lista todas as movimentações com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de movimentações
   */
  findAll(filters?: CashFlowFilters): Promise<CashFlow[]>;

  /**
   * Busca movimentações com paginação
   * @param page - Número da página
   * @param limit - Quantidade por página
   * @param filters - Filtros opcionais
   * @returns Promise com movimentações e metadados de paginação
   */
  findPaginated(page: number, limit: number, filters?: CashFlowFilters): Promise<{
    data: CashFlow[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  /**
   * Busca movimentações em um período
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com array de movimentações
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<CashFlow[]>;

  /**
   * Busca movimentações do dia atual
   * @returns Promise com array de movimentações do dia
   */
  findToday(): Promise<CashFlow[]>;

  /**
   * Busca movimentações de um tipo específico
   * @param type - Tipo de movimentação
   * @returns Promise com array de movimentações
   */
  findByType(type: CashFlowType): Promise<CashFlow[]>;

  /**
   * Busca movimentações de uma categoria
   * @param category - Categoria da movimentação
   * @returns Promise com array de movimentações
   */
  findByCategory(category: CashFlowCategory): Promise<CashFlow[]>;

  /**
   * Busca movimentações relacionadas a uma venda
   * @param saleId - ID da venda
   * @returns Promise com array de movimentações
   */
  findBySaleId(saleId: string): Promise<CashFlow[]>;

  /**
   * Busca movimentações relacionadas a uma conta financeira
   * @param accountId - ID da conta financeira
   * @returns Promise com array de movimentações
   */
  findByAccountId(accountId: string): Promise<CashFlow[]>;

  /**
   * Atualiza uma movimentação existente
   * @param id - ID da movimentação a atualizar
   * @param cashFlow - Dados parciais para atualização
   * @returns Promise com a movimentação atualizada
   */
  update(id: string, cashFlow: Partial<CashFlow>): Promise<CashFlow>;

  /**
   * Remove uma movimentação
   * @param id - ID da movimentação a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Obtém resumo do fluxo de caixa em um período (RF17)
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com resumo do fluxo de caixa
   */
  getSummary(startDate: Date, endDate: Date): Promise<CashFlowSummary>;

  /**
   * Obtém saldo atual do caixa
   * @returns Promise com o saldo atual
   */
  getCurrentBalance(): Promise<number>;

  /**
   * Obtém saldo inicial de um período
   * @param date - Data de referência
   * @returns Promise com o saldo inicial
   */
  getOpeningBalance(date: Date): Promise<number>;

  /**
   * Conta o total de movimentações
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: CashFlowFilters): Promise<number>;

  /**
   * Obtém as últimas movimentações
   * @param limit - Quantidade de movimentações
   * @returns Promise com array de movimentações mais recentes
   */
  getLatest(limit: number): Promise<CashFlow[]>;
}
