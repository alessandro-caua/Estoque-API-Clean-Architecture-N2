// ============================================================================
// ENTIDADE: SALE (VENDA)
// ============================================================================
// Representa uma venda realizada no mercantil.
// 
// Requisitos atendidos:
// - RF06: Permitir realização de vendas (sem PDV dedicado)
// - RF07: Registrar diferentes formas de pagamento
// - RF08: Emitir nota/cupom da venda
// - RF09: Aplicar descontos e promoções durante a venda
// ============================================================================

import { SaleItem } from './SaleItem';

/**
 * Enum para os métodos de pagamento aceitos
 * @description RF07: Registrar diferentes formas de pagamento
 */
export enum PaymentMethod {
  /** Pagamento em dinheiro */
  CASH = 'CASH',
  /** Pagamento com cartão (débito/crédito) */
  CARD = 'CARD',
  /** Pagamento via PIX */
  PIX = 'PIX',
  /** Pagamento no fiado (crédito do cliente) */
  FIADO = 'FIADO',
}

/**
 * Enum para o status do pagamento
 */
export enum PaymentStatus {
  /** Pagamento realizado */
  PAID = 'PAID',
  /** Pagamento pendente (fiado) */
  PENDING = 'PENDING',
  /** Venda cancelada */
  CANCELLED = 'CANCELLED',
}

/**
 * Interface de propriedades da venda
 */
export interface SaleProps {
  id?: string;
  clientId?: string | null;
  userId: string;
  subtotal: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  items?: SaleItem[];
}

/**
 * Entidade Sale - Camada de Domínio
 * @description Representa uma venda com suas regras de negócio
 * @example
 * const sale = new Sale({
 *   userId: 'user-uuid',
 *   subtotal: 100.00,
 *   total: 90.00,
 *   discount: 10.00,
 *   paymentMethod: PaymentMethod.PIX
 * });
 */
export class Sale {
  private _id?: string;
  private _clientId?: string | null;
  private _userId: string;
  private _subtotal: number;
  private _discount: number;
  private _total: number;
  private _paymentMethod: PaymentMethod;
  private _paymentStatus: PaymentStatus;
  private _notes?: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _items: SaleItem[];

  constructor(props: SaleProps) {
    this._id = props.id;
    this._clientId = props.clientId;
    this._userId = props.userId;
    this._subtotal = props.subtotal;
    this._discount = props.discount ?? 0;
    this._total = props.total;
    this._paymentMethod = props.paymentMethod;
    this._paymentStatus = props.paymentStatus ?? PaymentStatus.PAID;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._items = props.items ?? [];

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados da venda
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (this._subtotal < 0) {
      throw new Error('Subtotal não pode ser negativo');
    }

    if (this._discount < 0) {
      throw new Error('Desconto não pode ser negativo');
    }

    if (this._total < 0) {
      throw new Error('Total não pode ser negativo');
    }

    if (this._discount > this._subtotal) {
      throw new Error('Desconto não pode ser maior que o subtotal');
    }

    // Se for fiado, precisa ter cliente
    if (this._paymentMethod === PaymentMethod.FIADO && !this._clientId) {
      throw new Error('Venda no fiado requer um cliente cadastrado');
    }
  }

  // ==================== GETTERS ====================

  get id(): string | undefined {
    return this._id;
  }

  get clientId(): string | null | undefined {
    return this._clientId;
  }

  get userId(): string {
    return this._userId;
  }

  get subtotal(): number {
    return this._subtotal;
  }

  get discount(): number {
    return this._discount;
  }

  get total(): number {
    return this._total;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  get paymentStatus(): PaymentStatus {
    return this._paymentStatus;
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

  get items(): SaleItem[] {
    return this._items;
  }

  // ==================== SETTERS ====================

  set discount(value: number) {
    if (value < 0) {
      throw new Error('Desconto não pode ser negativo');
    }
    if (value > this._subtotal) {
      throw new Error('Desconto não pode ser maior que o subtotal');
    }
    this._discount = value;
    this.recalculateTotal();
  }

  set paymentStatus(value: PaymentStatus) {
    this._paymentStatus = value;
  }

  set notes(value: string | null | undefined) {
    this._notes = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Recalcula o total da venda
   */
  private recalculateTotal(): void {
    this._total = this._subtotal - this._discount;
  }

  /**
   * Adiciona um item à venda
   * @param item - Item a ser adicionado
   */
  addItem(item: SaleItem): void {
    this._items.push(item);
    this._subtotal += item.total;
    this.recalculateTotal();
  }

  /**
   * Remove um item da venda
   * @param itemId - ID do item a ser removido
   */
  removeItem(itemId: string): void {
    const index = this._items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const item = this._items[index];
      this._subtotal -= item.total;
      this._items.splice(index, 1);
      this.recalculateTotal();
    }
  }

  /**
   * Verifica se a venda é no fiado
   * @returns true se a forma de pagamento for fiado
   */
  isCredit(): boolean {
    return this._paymentMethod === PaymentMethod.FIADO;
  }

  /**
   * Verifica se a venda está paga
   * @returns true se o status for PAID
   */
  isPaid(): boolean {
    return this._paymentStatus === PaymentStatus.PAID;
  }

  /**
   * Verifica se a venda está pendente
   * @returns true se o status for PENDING
   */
  isPending(): boolean {
    return this._paymentStatus === PaymentStatus.PENDING;
  }

  /**
   * Verifica se a venda foi cancelada
   * @returns true se o status for CANCELLED
   */
  isCancelled(): boolean {
    return this._paymentStatus === PaymentStatus.CANCELLED;
  }

  /**
   * Cancela a venda
   */
  cancel(): void {
    if (this._paymentStatus === PaymentStatus.CANCELLED) {
      throw new Error('Venda já está cancelada');
    }
    this._paymentStatus = PaymentStatus.CANCELLED;
  }

  /**
   * Marca a venda como paga
   */
  markAsPaid(): void {
    if (this._paymentStatus === PaymentStatus.CANCELLED) {
      throw new Error('Não é possível marcar venda cancelada como paga');
    }
    this._paymentStatus = PaymentStatus.PAID;
  }

  /**
   * Calcula a porcentagem de desconto aplicada
   * @returns Porcentagem de desconto
   */
  getDiscountPercentage(): number {
    if (this._subtotal === 0) return 0;
    return (this._discount / this._subtotal) * 100;
  }

  /**
   * Retorna o número de itens na venda
   * @returns Quantidade total de itens
   */
  getTotalItems(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto com os dados da venda
   */
  toJSON() {
    return {
      id: this._id,
      clientId: this._clientId,
      userId: this._userId,
      subtotal: this._subtotal,
      discount: this._discount,
      total: this._total,
      paymentMethod: this._paymentMethod,
      paymentStatus: this._paymentStatus,
      notes: this._notes,
      items: this._items.map(item => item.toJSON()),
      totalItems: this.getTotalItems(),
      discountPercentage: this.getDiscountPercentage(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
