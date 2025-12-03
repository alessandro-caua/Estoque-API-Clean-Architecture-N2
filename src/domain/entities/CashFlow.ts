// ============================================================================
// ENTIDADE: CASH FLOW (FLUXO DE CAIXA)
// ============================================================================
// Representa um registro de movimentação financeira no fluxo de caixa.
// 
// Requisitos atendidos:
// - RF16: Gerar fluxo de caixa (diário, mensal e anual)
// ============================================================================

/**
 * Enum para os tipos de movimentação no fluxo de caixa
 */
export enum CashFlowType {
  /** Entrada de dinheiro */
  INCOME = 'INCOME',
  /** Saída de dinheiro */
  EXPENSE = 'EXPENSE',
}

/**
 * Enum para categorias do fluxo de caixa
 */
export enum CashFlowCategory {
  /** Venda */
  SALE = 'SALE',
  /** Compra de fornecedor */
  PURCHASE = 'PURCHASE',
  /** Salário */
  SALARY = 'SALARY',
  /** Aluguel */
  RENT = 'RENT',
  /** Outros */
  OTHER = 'OTHER',
}

/**
 * Interface de propriedades do fluxo de caixa
 */
export interface CashFlowProps {
  id?: string;
  type: CashFlowType;
  category: CashFlowCategory;
  description: string;
  amount: number;
  date: Date;
  referenceId?: string | null;
  createdAt?: Date;
}

/**
 * Entidade CashFlow - Camada de Domínio
 * @description Representa um registro no fluxo de caixa
 * @example
 * const cashFlow = new CashFlow({
 *   type: CashFlowType.INCOME,
 *   category: CashFlowCategory.SALE,
 *   description: 'Venda #123',
 *   amount: 150.00,
 *   date: new Date()
 * });
 */
export class CashFlow {
  private _id?: string;
  private _type: CashFlowType;
  private _category: CashFlowCategory;
  private _description: string;
  private _amount: number;
  private _date: Date;
  private _referenceId?: string | null;
  private _createdAt?: Date;

  constructor(props: CashFlowProps) {
    this._id = props.id;
    this._type = props.type;
    this._category = props.category;
    this._description = props.description;
    this._amount = props.amount;
    this._date = props.date;
    this._referenceId = props.referenceId;
    this._createdAt = props.createdAt;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do fluxo de caixa
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._description || this._description.trim().length < 3) {
      throw new Error('Descrição deve ter pelo menos 3 caracteres');
    }

    if (this._amount <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (!this._date) {
      throw new Error('Data é obrigatória');
    }
  }

  // ==================== GETTERS ====================

  get id(): string | undefined {
    return this._id;
  }

  get type(): CashFlowType {
    return this._type;
  }

  get category(): CashFlowCategory {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get amount(): number {
    return this._amount;
  }

  get date(): Date {
    return this._date;
  }

  get referenceId(): string | null | undefined {
    return this._referenceId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se é uma entrada
   * @returns true se for entrada
   */
  isIncome(): boolean {
    return this._type === CashFlowType.INCOME;
  }

  /**
   * Verifica se é uma saída
   * @returns true se for saída
   */
  isExpense(): boolean {
    return this._type === CashFlowType.EXPENSE;
  }

  /**
   * Retorna o valor com sinal (positivo para entrada, negativo para saída)
   * @returns Valor com sinal
   */
  getSignedAmount(): number {
    return this._type === CashFlowType.INCOME ? this._amount : -this._amount;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto com os dados do fluxo de caixa
   */
  toJSON() {
    return {
      id: this._id,
      type: this._type,
      category: this._category,
      description: this._description,
      amount: this._amount,
      signedAmount: this.getSignedAmount(),
      date: this._date,
      referenceId: this._referenceId,
      createdAt: this._createdAt,
    };
  }
}
