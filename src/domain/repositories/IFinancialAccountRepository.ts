// ============================================================================
// INTERFACE: IFINANCIALACCOUNTREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de contas financeiras.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF15: Registro de contas a pagar
// - RF16: Registro de contas a receber
// - RF17: Relatórios financeiros
// ============================================================================

import { 
  FinancialAccount, 
  AccountType, 
  AccountStatus, 
  AccountCategory 
} from '../entities/FinancialAccount';

/**
 * Filtros para busca de contas financeiras
 */
export interface FinancialAccountFilters {
  /** Filtrar por tipo (pagar/receber) */
  type?: AccountType;
  /** Filtrar por status */
  status?: AccountStatus;
  /** Filtrar por categoria */
  category?: AccountCategory;
  /** Data de vencimento inicial */
  startDate?: Date;
  /** Data de vencimento final */
  endDate?: Date;
}

/**
 * Resumo financeiro para relatórios
 */
export interface FinancialSummary {
  /** Total de contas a pagar */
  totalPayable: number;
  /** Total de contas a receber */
  totalReceivable: number;
  /** Total de contas pagas */
  totalPaid: number;
  /** Total de contas recebidas */
  totalReceived: number;
  /** Total de contas vencidas (pagar) */
  overduePayable: number;
  /** Total de contas vencidas (receber) */
  overdueReceivable: number;
  /** Saldo (receber - pagar) */
  balance: number;
}

/**
 * Interface do repositório de FinancialAccount - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de contas financeiras deve fornecer.
 */
export interface IFinancialAccountRepository {
  /**
   * Cria uma nova conta financeira
   * @param account - Entidade FinancialAccount a ser persistida
   * @returns Promise com a conta criada (incluindo ID gerado)
   */
  create(account: FinancialAccount): Promise<FinancialAccount>;

  /**
   * Busca uma conta pelo ID
   * @param id - Identificador único da conta
   * @returns Promise com a conta encontrada ou null
   */
  findById(id: string): Promise<FinancialAccount | null>;

  /**
   * Lista todas as contas com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de contas
   */
  findAll(filters?: FinancialAccountFilters): Promise<FinancialAccount[]>;

  /**
   * Busca contas por tipo (pagar/receber)
   * @param type - Tipo de conta
   * @returns Promise com array de contas
   */
  findByType(type: AccountType): Promise<FinancialAccount[]>;

  /**
   * Busca contas por status
   * @param status - Status da conta
   * @returns Promise com array de contas
   */
  findByStatus(status: AccountStatus): Promise<FinancialAccount[]>;

  /**
   * Busca contas vencidas
   * @returns Promise com array de contas vencidas
   */
  findOverdue(): Promise<FinancialAccount[]>;

  /**
   * Busca contas a vencer em X dias
   * @param days - Número de dias
   * @returns Promise com array de contas
   */
  findDueSoon(days: number): Promise<FinancialAccount[]>;

  /**
   * Busca contas por período de vencimento
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @param type - Tipo de conta (opcional)
   * @returns Promise com array de contas
   */
  findByPeriod(startDate: Date, endDate: Date, type?: AccountType): Promise<FinancialAccount[]>;

  /**
   * Atualiza uma conta existente
   * @param id - ID da conta a atualizar
   * @param account - Dados parciais para atualização
   * @returns Promise com a conta atualizada
   */
  update(id: string, account: Partial<FinancialAccount>): Promise<FinancialAccount>;

  /**
   * Marca uma conta como paga/recebida
   * @param id - ID da conta
   * @param paidDate - Data do pagamento
   * @returns Promise com a conta atualizada
   */
  pay(id: string, paidDate: Date): Promise<FinancialAccount>;

  /**
   * Cancela uma conta
   * @param id - ID da conta
   * @returns Promise com a conta cancelada
   */
  cancel(id: string): Promise<FinancialAccount>;

  /**
   * Remove uma conta
   * @param id - ID da conta a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Obtém resumo financeiro em um período (RF17)
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com resumo financeiro
   */
  getSummary(startDate: Date, endDate: Date): Promise<FinancialSummary>;

  /**
   * Conta o total de contas
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: FinancialAccountFilters): Promise<number>;
}
