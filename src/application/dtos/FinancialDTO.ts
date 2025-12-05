// ============================================================================
// DTOs FINANCEIROS
// ============================================================================
// 
// O módulo financeiro controla o fluxo de caixa do negócio.
// Registra contas a pagar (despesas) e a receber (receitas).
// 
// CONCEITOS FINANCEIROS:
// 
// CONTAS A PAGAR (Payable):
// - Despesas da empresa
// - Ex: Conta de luz, aluguel, fornecedores
// - Dinheiro que SAI
// 
// CONTAS A RECEBER (Receivable):
// - Receitas da empresa
// - Ex: Vendas fiado, cheques a compensar
// - Dinheiro que ENTRA
// 
// STATUS DAS CONTAS:
// - PENDING: Aguardando pagamento
// - PAID: Paga
// - OVERDUE: Vencida (passou da data e não foi paga)
// - CANCELLED: Cancelada
// 
// FLUXO DE CAIXA:
// Entradas - Saídas = Saldo
// 
// ============================================================================

import { AccountCategory } from '../../domain/entities/FinancialAccount';

/**
 * DTO para criação de conta financeira
 * 
 * @description
 * Usado tanto para contas a pagar quanto a receber.
 * O Use Case define o tipo baseado em qual Use Case foi chamado.
 * 
 * @example
 * ```typescript
 * // Conta a pagar (despesa)
 * const contaPagar: CreateFinancialAccountDTO = {
 *   category: AccountCategory.SUPPLIERS,  // Fornecedores
 *   description: 'Compra de mercadorias - NF 12345',
 *   amount: 5000.00,
 *   dueDate: new Date('2025-12-15'),
 *   referenceId: 'uuid-do-pedido-compra',
 *   notes: 'Parcelamento 1/3'
 * };
 * 
 * // Conta a receber (receita)
 * const contaReceber: CreateFinancialAccountDTO = {
 *   category: AccountCategory.SALES,  // Vendas
 *   description: 'Venda fiado - Cliente João',
 *   amount: 150.00,
 *   dueDate: new Date('2025-12-10'),
 *   referenceId: 'uuid-da-venda'
 * };
 * ```
 */
export interface CreateFinancialAccountDTO {
  /**
   * Categoria da conta
   * - Obrigatório
   * - Agrupa contas similares para relatórios
   * 
   * Categorias comuns:
   * - SALES: Vendas
   * - SUPPLIERS: Fornecedores
   * - UTILITIES: Contas de consumo (água, luz, internet)
   * - RENT: Aluguel
   * - SALARY: Salários
   * - TAXES: Impostos
   * - OTHER: Outros
   */
  category: AccountCategory;

  /**
   * Descrição da conta
   * - Obrigatório
   * - Descreve o que é essa conta
   */
  description: string;

  /**
   * Valor da conta
   * - Obrigatório
   * - Em Reais (R$)
   * - Sempre positivo
   */
  amount: number;

  /**
   * Data de vencimento
   * - Obrigatório
   * - Após essa data, a conta fica "vencida"
   */
  dueDate: Date;

  /**
   * Referência a outro registro
   * - Opcional
   * - Ex: ID de uma venda, pedido de compra, etc.
   * - Útil para rastreabilidade
   */
  referenceId?: string;

  /**
   * Observações
   * - Opcional
   * - Informações adicionais
   */
  notes?: string;
}

/**
 * DTO para registro de pagamento
 * 
 * @description
 * Marca uma conta como paga.
 * 
 * @example
 * ```typescript
 * const dto: RegisterPaymentDTO = {
 *   accountId: 'uuid-da-conta',
 *   paidAt: new Date()  // Pago agora
 * };
 * ```
 */
export interface RegisterPaymentDTO {
  /**
   * ID da conta a ser paga
   * - Obrigatório
   */
  accountId: string;

  /**
   * Data do pagamento
   * - Opcional (padrão: data atual)
   * - Pode ser retroativo
   */
  paidAt?: Date;
}

/**
 * DTO para filtros de contas financeiras
 */
export interface FinancialAccountFiltersDTO {
  /** Tipo: 'payable' ou 'receivable' */
  type?: string;

  /** Status: 'pending', 'paid', 'overdue', 'cancelled' */
  status?: string;

  /** Categoria */
  category?: AccountCategory;

  /** Data inicial de vencimento */
  dueDateStart?: Date;

  /** Data final de vencimento */
  dueDateEnd?: Date;

  /** Apenas vencidas */
  overdue?: boolean;

  /** Página */
  page?: number;

  /** Itens por página */
  limit?: number;
}

/**
 * DTO de resposta para resumo financeiro
 * 
 * @description
 * Resume a situação financeira do período.
 * Essencial para gestão do negócio.
 */
export interface FinancialSummaryDTO {
  /**
   * Total de receitas (contas a receber pagas)
   */
  totalReceived: number;

  /**
   * Total de despesas (contas a pagar pagas)
   */
  totalPaid: number;

  /**
   * Saldo (Receitas - Despesas)
   * Positivo = lucro, Negativo = prejuízo
   */
  balance: number;

  /**
   * Total pendente a receber
   */
  pendingReceivables: number;

  /**
   * Total pendente a pagar
   */
  pendingPayables: number;

  /**
   * Total de contas vencidas
   */
  overdueAmount: number;
}
