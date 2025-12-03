// ============================================================================
// ENTIDADE: FINANCIAL ACCOUNT (CONTA FINANCEIRA)
// ============================================================================
// Representa uma conta a pagar ou a receber do mercantil.
// 
// Requisitos atendidos:
// - RF15: Registrar contas a pagar e a receber
// ============================================================================

/**
 * Enum para os tipos de conta financeira
 */
export enum AccountType {
  /** Conta a pagar */
  PAYABLE = 'PAYABLE',
  /** Conta a receber */
  RECEIVABLE = 'RECEIVABLE',
}

/**
 * Enum para o status da conta
 */
export enum AccountStatus {
  /** Pendente de pagamento */
  PENDING = 'PENDING',
  /** Pago/Recebido */
  PAID = 'PAID',
  /** Vencido */
  OVERDUE = 'OVERDUE',
  /** Cancelado */
  CANCELLED = 'CANCELLED',
}

/**
 * Enum para categorias de contas
 */
export enum AccountCategory {
  /** Fornecedor */
  SUPPLIER = 'SUPPLIER',
  /** Aluguel */
  RENT = 'RENT',
  /** Salário */
  SALARY = 'SALARY',
  /** Utilidades (água, luz, etc) */
  UTILITIES = 'UTILITIES',
  /** Outros */
  OTHER = 'OTHER',
}

/**
 * Interface de propriedades da conta financeira
 */
export interface FinancialAccountProps {
  id?: string;
  type: AccountType;
  description: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date | null;
  status?: AccountStatus;
  category?: AccountCategory | null;
  referenceId?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Entidade FinancialAccount - Camada de Domínio
 * @description Representa uma conta financeira com suas regras de negócio
 * @example
 * const account = new FinancialAccount({
 *   type: AccountType.PAYABLE,
 *   description: 'Pagamento fornecedor ABC',
 *   amount: 1500.00,
 *   dueDate: new Date('2024-01-15'),
 *   category: AccountCategory.SUPPLIER
 * });
 */
export class FinancialAccount {
  private _id?: string;
  private _type: AccountType;
  private _description: string;
  private _amount: number;
  private _dueDate: Date;
  private _paidDate?: Date | null;
  private _status: AccountStatus;
  private _category?: AccountCategory | null;
  private _referenceId?: string | null;
  private _notes?: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: FinancialAccountProps) {
    this._id = props.id;
    this._type = props.type;
    this._description = props.description;
    this._amount = props.amount;
    this._dueDate = props.dueDate;
    this._paidDate = props.paidDate;
    this._status = props.status ?? AccountStatus.PENDING;
    this._category = props.category;
    this._referenceId = props.referenceId;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados da conta
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._description || this._description.trim().length < 3) {
      throw new Error('Descrição deve ter pelo menos 3 caracteres');
    }

    if (this._amount <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (!this._dueDate) {
      throw new Error('Data de vencimento é obrigatória');
    }
  }

  // ==================== GETTERS ====================

  get id(): string | undefined {
    return this._id;
  }

  get type(): AccountType {
    return this._type;
  }

  get description(): string {
    return this._description;
  }

  get amount(): number {
    return this._amount;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  get paidDate(): Date | null | undefined {
    return this._paidDate;
  }

  get status(): AccountStatus {
    return this._status;
  }

  get category(): AccountCategory | null | undefined {
    return this._category;
  }

  get referenceId(): string | null | undefined {
    return this._referenceId;
  }

  get notes(): string | null | undefined {
    return this._notes;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // ==================== SETTERS ====================

  set description(value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error('Descrição deve ter pelo menos 3 caracteres');
    }
    this._description = value;
  }

  set amount(value: number) {
    if (value <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }
    this._amount = value;
  }

  set dueDate(value: Date) {
    this._dueDate = value;
  }

  set notes(value: string | null | undefined) {
    this._notes = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se a conta é a pagar
   * @returns true se for conta a pagar
   */
  isPayable(): boolean {
    return this._type === AccountType.PAYABLE;
  }

  /**
   * Verifica se a conta é a receber
   * @returns true se for conta a receber
   */
  isReceivable(): boolean {
    return this._type === AccountType.RECEIVABLE;
  }

  /**
   * Verifica se a conta está vencida
   * @returns true se estiver vencida
   */
  isOverdue(): boolean {
    if (this._status === AccountStatus.PAID || this._status === AccountStatus.CANCELLED) {
      return false;
    }
    return new Date() > this._dueDate;
  }

  /**
   * Verifica se a conta está paga
   * @returns true se estiver paga
   */
  isPaid(): boolean {
    return this._status === AccountStatus.PAID;
  }

  /**
   * Verifica se a conta está pendente
   * @returns true se estiver pendente
   */
  isPending(): boolean {
    return this._status === AccountStatus.PENDING;
  }

  /**
   * Marca a conta como paga
   * @param paidDate - Data do pagamento (default: hoje)
   */
  markAsPaid(paidDate?: Date): void {
    if (this._status === AccountStatus.CANCELLED) {
      throw new Error('Não é possível pagar conta cancelada');
    }
    this._status = AccountStatus.PAID;
    this._paidDate = paidDate ?? new Date();
  }

  /**
   * Cancela a conta
   */
  cancel(): void {
    if (this._status === AccountStatus.PAID) {
      throw new Error('Não é possível cancelar conta já paga');
    }
    this._status = AccountStatus.CANCELLED;
  }

  /**
   * Atualiza o status para vencido se necessário
   */
  updateOverdueStatus(): void {
    if (this.isOverdue() && this._status === AccountStatus.PENDING) {
      this._status = AccountStatus.OVERDUE;
    }
  }

  /**
   * Calcula dias até o vencimento (negativo se vencido)
   * @returns Número de dias
   */
  getDaysUntilDue(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this._dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto com os dados da conta
   */
  toJSON() {
    return {
      id: this._id,
      type: this._type,
      description: this._description,
      amount: this._amount,
      dueDate: this._dueDate,
      paidDate: this._paidDate,
      status: this._status,
      category: this._category,
      referenceId: this._referenceId,
      notes: this._notes,
      isOverdue: this.isOverdue(),
      daysUntilDue: this.getDaysUntilDue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
