// ============================================================================
// ENTIDADE: PURCHASE ORDER (PEDIDO DE COMPRA)
// ============================================================================
// Representa um pedido de compra feito a um fornecedor.
// Controla o processo de reposição de estoque.
// 
// Requisitos atendidos:
// - RF14: Registro de pedidos de compra a fornecedores
// - RF06: Registro de entrada de produtos (ao receber o pedido)
// ============================================================================

import { Supplier } from './Supplier';
import { PurchaseItem } from './PurchaseItem';

/**
 * Status do pedido de compra
 */
export enum PurchaseOrderStatus {
  /** Pedido criado mas não enviado */
  DRAFT = 'DRAFT',
  /** Pedido enviado ao fornecedor */
  PENDING = 'PENDING',
  /** Pedido parcialmente recebido */
  PARTIAL = 'PARTIAL',
  /** Pedido totalmente recebido */
  RECEIVED = 'RECEIVED',
  /** Pedido cancelado */
  CANCELLED = 'CANCELLED',
}

/**
 * Interface de propriedades do pedido de compra
 * @description Define a estrutura de dados para criar/atualizar um pedido
 */
export interface PurchaseOrderProps {
  /** Identificador único do pedido (UUID) */
  id?: string;
  /** Número do pedido (sequencial ou customizado) */
  orderNumber?: string | null;
  /** ID do fornecedor */
  supplierId: string;
  /** Status atual do pedido */
  status?: PurchaseOrderStatus;
  /** Valor total do pedido */
  totalAmount?: number;
  /** Observações ou notas */
  notes?: string | null;
  /** Data prevista para entrega */
  expectedDeliveryDate?: Date | null;
  /** Data real de recebimento */
  receivedDate?: Date | null;
  /** ID do usuário que criou o pedido */
  userId?: string | null;
  /** Data de criação do registro */
  createdAt?: Date;
  /** Data da última atualização */
  updatedAt?: Date;
  /** Objeto do fornecedor (para relacionamentos) */
  supplier?: Supplier;
  /** Lista de itens do pedido */
  items?: PurchaseItem[];
}

/**
 * Entidade PurchaseOrder - Camada de Domínio
 * @description Representa um pedido de compra com suas regras de negócio.
 *              Pedidos de compra são usados para solicitar produtos
 *              aos fornecedores e controlar o recebimento.
 * @example
 * ```typescript
 * const purchaseOrder = new PurchaseOrder({
 *   supplierId: 'fornecedor-uuid',
 *   expectedDeliveryDate: new Date('2024-02-15'),
 *   notes: 'Urgente - estoque baixo'
 * });
 * ```
 */
export class PurchaseOrder {
  private _id?: string;
  private _orderNumber?: string | null;
  private _supplierId: string;
  private _status: PurchaseOrderStatus;
  private _totalAmount: number;
  private _notes?: string | null;
  private _expectedDeliveryDate?: Date | null;
  private _receivedDate?: Date | null;
  private _userId?: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _supplier?: Supplier;
  private _items: PurchaseItem[];

  /**
   * Construtor da entidade PurchaseOrder
   * @param props - Propriedades iniciais do pedido
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: PurchaseOrderProps) {
    this._id = props.id;
    this._orderNumber = props.orderNumber;
    this._supplierId = props.supplierId;
    this._status = props.status ?? PurchaseOrderStatus.DRAFT;
    this._totalAmount = props.totalAmount ?? 0;
    this._notes = props.notes;
    this._expectedDeliveryDate = props.expectedDeliveryDate;
    this._receivedDate = props.receivedDate;
    this._userId = props.userId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._supplier = props.supplier;
    this._items = props.items ?? [];

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do pedido
   * @private
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._supplierId) {
      throw new Error('Fornecedor é obrigatório para criar um pedido de compra');
    }

    if (this._totalAmount < 0) {
      throw new Error('Valor total não pode ser negativo');
    }
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único do pedido
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Número do pedido
   */
  get orderNumber(): string | null | undefined {
    return this._orderNumber;
  }

  /**
   * ID do fornecedor
   */
  get supplierId(): string {
    return this._supplierId;
  }

  /**
   * Status do pedido
   */
  get status(): PurchaseOrderStatus {
    return this._status;
  }

  /**
   * Valor total do pedido
   */
  get totalAmount(): number {
    return this._totalAmount;
  }

  /**
   * Observações
   */
  get notes(): string | null | undefined {
    return this._notes;
  }

  /**
   * Data prevista para entrega
   */
  get expectedDeliveryDate(): Date | null | undefined {
    return this._expectedDeliveryDate;
  }

  /**
   * Data de recebimento
   */
  get receivedDate(): Date | null | undefined {
    return this._receivedDate;
  }

  /**
   * ID do usuário que criou
   */
  get userId(): string | null | undefined {
    return this._userId;
  }

  /**
   * Data de criação
   */
  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  /**
   * Data da última atualização
   */
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  /**
   * Objeto do fornecedor
   */
  get supplier(): Supplier | undefined {
    return this._supplier;
  }

  /**
   * Lista de itens do pedido
   */
  get items(): PurchaseItem[] {
    return this._items;
  }

  // ==================== SETTERS ====================

  /**
   * Define o número do pedido
   * @param value - Novo número
   */
  set orderNumber(value: string | null | undefined) {
    this._orderNumber = value;
  }

  /**
   * Define as observações
   * @param value - Novas observações
   */
  set notes(value: string | null | undefined) {
    this._notes = value;
  }

  /**
   * Define a data prevista de entrega
   * @param value - Nova data
   */
  set expectedDeliveryDate(value: Date | null | undefined) {
    this._expectedDeliveryDate = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Adiciona um item ao pedido
   * @param item - Item a ser adicionado
   * @throws Error se o pedido não estiver em rascunho
   */
  addItem(item: PurchaseItem): void {
    if (this._status !== PurchaseOrderStatus.DRAFT) {
      throw new Error('Só é possível adicionar itens em pedidos em rascunho');
    }
    this._items.push(item);
    this.recalculateTotal();
  }

  /**
   * Remove um item do pedido pelo índice
   * @param index - Índice do item a remover
   * @throws Error se o pedido não estiver em rascunho
   */
  removeItem(index: number): void {
    if (this._status !== PurchaseOrderStatus.DRAFT) {
      throw new Error('Só é possível remover itens em pedidos em rascunho');
    }
    if (index < 0 || index >= this._items.length) {
      throw new Error('Índice de item inválido');
    }
    this._items.splice(index, 1);
    this.recalculateTotal();
  }

  /**
   * Recalcula o valor total baseado nos itens
   * @private
   */
  private recalculateTotal(): void {
    this._totalAmount = this._items.reduce(
      (total, item) => total + item.getTotalPrice(),
      0
    );
  }

  /**
   * Envia o pedido ao fornecedor
   * @throws Error se o pedido não tiver itens ou não estiver em rascunho
   */
  send(): void {
    if (this._status !== PurchaseOrderStatus.DRAFT) {
      throw new Error('Apenas pedidos em rascunho podem ser enviados');
    }
    if (this._items.length === 0) {
      throw new Error('Pedido deve ter pelo menos um item para ser enviado');
    }
    this._status = PurchaseOrderStatus.PENDING;
  }

  /**
   * Marca o pedido como parcialmente recebido
   */
  markAsPartiallyReceived(): void {
    if (this._status !== PurchaseOrderStatus.PENDING && 
        this._status !== PurchaseOrderStatus.PARTIAL) {
      throw new Error('Apenas pedidos pendentes podem ser marcados como parcialmente recebidos');
    }
    this._status = PurchaseOrderStatus.PARTIAL;
  }

  /**
   * Marca o pedido como totalmente recebido
   */
  markAsReceived(): void {
    if (this._status === PurchaseOrderStatus.CANCELLED) {
      throw new Error('Pedido cancelado não pode ser marcado como recebido');
    }
    if (this._status === PurchaseOrderStatus.RECEIVED) {
      throw new Error('Pedido já foi recebido');
    }
    this._status = PurchaseOrderStatus.RECEIVED;
    this._receivedDate = new Date();
  }

  /**
   * Cancela o pedido
   * @throws Error se o pedido já foi recebido
   */
  cancel(): void {
    if (this._status === PurchaseOrderStatus.RECEIVED) {
      throw new Error('Pedido já recebido não pode ser cancelado');
    }
    if (this._status === PurchaseOrderStatus.CANCELLED) {
      throw new Error('Pedido já está cancelado');
    }
    this._status = PurchaseOrderStatus.CANCELLED;
  }

  /**
   * Verifica se o pedido está em rascunho
   */
  isDraft(): boolean {
    return this._status === PurchaseOrderStatus.DRAFT;
  }

  /**
   * Verifica se o pedido está pendente
   */
  isPending(): boolean {
    return this._status === PurchaseOrderStatus.PENDING;
  }

  /**
   * Verifica se o pedido foi recebido
   */
  isReceived(): boolean {
    return this._status === PurchaseOrderStatus.RECEIVED;
  }

  /**
   * Verifica se o pedido foi cancelado
   */
  isCancelled(): boolean {
    return this._status === PurchaseOrderStatus.CANCELLED;
  }

  /**
   * Verifica se a entrega está atrasada
   */
  isOverdue(): boolean {
    if (!this._expectedDeliveryDate) return false;
    if (this._status === PurchaseOrderStatus.RECEIVED || 
        this._status === PurchaseOrderStatus.CANCELLED) {
      return false;
    }
    return new Date() > this._expectedDeliveryDate;
  }

  /**
   * Retorna a quantidade total de itens
   */
  getTotalItems(): number {
    return this._items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Retorna a quantidade de itens diferentes
   */
  getUniqueItemsCount(): number {
    return this._items.length;
  }

  /**
   * Retorna descrição do status em português
   */
  getStatusDescription(): string {
    const descriptions: Record<PurchaseOrderStatus, string> = {
      [PurchaseOrderStatus.DRAFT]: 'Rascunho',
      [PurchaseOrderStatus.PENDING]: 'Pendente',
      [PurchaseOrderStatus.PARTIAL]: 'Parcialmente Recebido',
      [PurchaseOrderStatus.RECEIVED]: 'Recebido',
      [PurchaseOrderStatus.CANCELLED]: 'Cancelado',
    };
    return descriptions[this._status] || this._status;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados do pedido
   */
  toJSON() {
    return {
      id: this._id,
      orderNumber: this._orderNumber,
      supplierId: this._supplierId,
      status: this._status,
      statusDescription: this.getStatusDescription(),
      totalAmount: this._totalAmount,
      notes: this._notes,
      expectedDeliveryDate: this._expectedDeliveryDate,
      receivedDate: this._receivedDate,
      userId: this._userId,
      // Campos calculados
      totalItems: this.getTotalItems(),
      uniqueItemsCount: this.getUniqueItemsCount(),
      isOverdue: this.isOverdue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      supplier: this._supplier?.toJSON(),
      items: this._items.map(item => item.toJSON()),
    };
  }
}
