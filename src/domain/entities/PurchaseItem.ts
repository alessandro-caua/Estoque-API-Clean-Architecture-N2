// ============================================================================
// ENTIDADE: PURCHASE ITEM (ITEM DE PEDIDO DE COMPRA)
// ============================================================================
// Representa um item individual dentro de um pedido de compra.
// Cada item corresponde a um produto com quantidade e preço específicos.
// 
// Requisitos atendidos:
// - RF14: Registro de pedidos de compra a fornecedores
// - RF06: Registro de entrada de produtos
// ============================================================================

import { Product } from './Product';

/**
 * Interface de propriedades do item de compra
 * @description Define a estrutura de dados para criar/atualizar um item
 */
export interface PurchaseItemProps {
  /** Identificador único do item (UUID) */
  id?: string;
  /** ID do pedido de compra */
  purchaseOrderId: string;
  /** ID do produto */
  productId: string;
  /** Quantidade solicitada */
  quantity: number;
  /** Preço unitário de compra */
  unitPrice: number;
  /** Quantidade já recebida */
  receivedQuantity?: number;
  /** Data de criação do registro */
  createdAt?: Date;
  /** Objeto do produto (para relacionamentos) */
  product?: Product;
}

/**
 * Entidade PurchaseItem - Camada de Domínio
 * @description Representa um item de pedido de compra com suas regras de negócio.
 *              Cada item é uma linha do pedido contendo produto, quantidade
 *              e preço negociado com o fornecedor.
 * @example
 * ```typescript
 * const item = new PurchaseItem({
 *   purchaseOrderId: 'pedido-uuid',
 *   productId: 'produto-uuid',
 *   quantity: 100,
 *   unitPrice: 5.50
 * });
 * ```
 */
export class PurchaseItem {
  private _id?: string;
  private _purchaseOrderId: string;
  private _productId: string;
  private _quantity: number;
  private _unitPrice: number;
  private _receivedQuantity: number;
  private _createdAt?: Date;
  private _product?: Product;

  /**
   * Construtor da entidade PurchaseItem
   * @param props - Propriedades iniciais do item
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: PurchaseItemProps) {
    this._id = props.id;
    this._purchaseOrderId = props.purchaseOrderId;
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._receivedQuantity = props.receivedQuantity ?? 0;
    this._createdAt = props.createdAt;
    this._product = props.product;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do item
   * @private
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._purchaseOrderId) {
      throw new Error('Pedido de compra é obrigatório');
    }

    if (!this._productId) {
      throw new Error('Produto é obrigatório');
    }

    if (this._quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (this._unitPrice < 0) {
      throw new Error('Preço unitário não pode ser negativo');
    }

    if (this._receivedQuantity < 0) {
      throw new Error('Quantidade recebida não pode ser negativa');
    }

    if (this._receivedQuantity > this._quantity) {
      throw new Error('Quantidade recebida não pode ser maior que a quantidade solicitada');
    }
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único do item
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * ID do pedido de compra
   */
  get purchaseOrderId(): string {
    return this._purchaseOrderId;
  }

  /**
   * ID do produto
   */
  get productId(): string {
    return this._productId;
  }

  /**
   * Quantidade solicitada
   */
  get quantity(): number {
    return this._quantity;
  }

  /**
   * Preço unitário
   */
  get unitPrice(): number {
    return this._unitPrice;
  }

  /**
   * Quantidade já recebida
   */
  get receivedQuantity(): number {
    return this._receivedQuantity;
  }

  /**
   * Data de criação
   */
  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  /**
   * Objeto do produto
   */
  get product(): Product | undefined {
    return this._product;
  }

  // ==================== SETTERS ====================

  /**
   * Define a quantidade solicitada
   * @param value - Nova quantidade
   * @throws Error se a quantidade for <= 0
   */
  set quantity(value: number) {
    if (value <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
    if (value < this._receivedQuantity) {
      throw new Error('Nova quantidade não pode ser menor que a quantidade já recebida');
    }
    this._quantity = value;
  }

  /**
   * Define o preço unitário
   * @param value - Novo preço
   * @throws Error se o preço for negativo
   */
  set unitPrice(value: number) {
    if (value < 0) {
      throw new Error('Preço unitário não pode ser negativo');
    }
    this._unitPrice = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Calcula o preço total do item
   * @returns Quantidade * Preço unitário
   */
  getTotalPrice(): number {
    return this._quantity * this._unitPrice;
  }

  /**
   * Calcula o valor já recebido
   * @returns Quantidade recebida * Preço unitário
   */
  getReceivedValue(): number {
    return this._receivedQuantity * this._unitPrice;
  }

  /**
   * Calcula o valor pendente de recebimento
   * @returns Valor total - Valor recebido
   */
  getPendingValue(): number {
    return this.getTotalPrice() - this.getReceivedValue();
  }

  /**
   * Retorna a quantidade pendente de recebimento
   * @returns Quantidade solicitada - Quantidade recebida
   */
  getPendingQuantity(): number {
    return this._quantity - this._receivedQuantity;
  }

  /**
   * Verifica se o item foi totalmente recebido
   * @returns true se quantidade recebida >= quantidade solicitada
   */
  isFullyReceived(): boolean {
    return this._receivedQuantity >= this._quantity;
  }

  /**
   * Verifica se o item foi parcialmente recebido
   * @returns true se há quantidade recebida mas não totalmente
   */
  isPartiallyReceived(): boolean {
    return this._receivedQuantity > 0 && this._receivedQuantity < this._quantity;
  }

  /**
   * Verifica se nada foi recebido ainda
   * @returns true se quantidade recebida = 0
   */
  isPendingReceiving(): boolean {
    return this._receivedQuantity === 0;
  }

  /**
   * Registra o recebimento de uma quantidade
   * @param amount - Quantidade a receber
   * @throws Error se a quantidade ultrapassar o pendente
   */
  receive(amount: number): void {
    if (amount <= 0) {
      throw new Error('Quantidade a receber deve ser maior que zero');
    }

    const pendingQuantity = this.getPendingQuantity();
    if (amount > pendingQuantity) {
      throw new Error(
        `Quantidade a receber (${amount}) excede a quantidade pendente (${pendingQuantity})`
      );
    }

    this._receivedQuantity += amount;
  }

  /**
   * Registra o recebimento total do item
   */
  receiveAll(): void {
    this._receivedQuantity = this._quantity;
  }

  /**
   * Calcula o percentual de recebimento
   * @returns Percentual de 0 a 100
   */
  getReceivedPercentage(): number {
    if (this._quantity === 0) return 0;
    return (this._receivedQuantity / this._quantity) * 100;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados do item
   */
  toJSON() {
    return {
      id: this._id,
      purchaseOrderId: this._purchaseOrderId,
      productId: this._productId,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      receivedQuantity: this._receivedQuantity,
      // Campos calculados
      totalPrice: this.getTotalPrice(),
      pendingQuantity: this.getPendingQuantity(),
      receivedValue: this.getReceivedValue(),
      pendingValue: this.getPendingValue(),
      receivedPercentage: this.getReceivedPercentage(),
      isFullyReceived: this.isFullyReceived(),
      createdAt: this._createdAt,
      product: this._product?.toJSON(),
    };
  }
}
