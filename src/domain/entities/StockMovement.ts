// ============================================================================
// ENTIDADE: STOCK MOVEMENT (MOVIMENTAÇÃO DE ESTOQUE)
// ============================================================================
// Representa uma movimentação de estoque (entrada, saída, ajuste, perda, devolução).
// Essencial para rastreabilidade e histórico de movimentações.
// 
// Requisitos atendidos:
// - RF06: Registro de entrada de produtos
// - RF07: Registro de saída de produtos (vendas)
// - RF08: Consulta de histórico de movimentações
// - RF18: Relatório de entradas e saídas
// ============================================================================

import { Product } from './Product';

/**
 * Tipos de movimentação de estoque
 * @description Define os tipos possíveis de movimentação
 */
export enum MovementType {
  /** Entrada de produtos (compra de fornecedor) */
  ENTRY = 'ENTRY',
  /** Saída de produtos (venda ao cliente) */
  EXIT = 'EXIT',
  /** Ajuste de estoque (inventário) */
  ADJUSTMENT = 'ADJUSTMENT',
  /** Perda de produtos (vencimento, dano, etc.) */
  LOSS = 'LOSS',
  /** Devolução de produtos (cliente devolveu) */
  RETURN = 'RETURN',
  /** Transferência entre locais */
  TRANSFER = 'TRANSFER',
}

/**
 * Interface de propriedades da movimentação
 * @description Define a estrutura de dados para criar uma movimentação
 */
export interface StockMovementProps {
  /** Identificador único da movimentação (UUID) */
  id?: string;
  /** ID do produto movimentado */
  productId: string;
  /** Tipo de movimentação */
  type: MovementType;
  /** Quantidade movimentada (sempre positiva) */
  quantity: number;
  /** Motivo ou descrição da movimentação */
  reason?: string | null;
  /** Preço unitário no momento da movimentação */
  unitPrice?: number | null;
  /** Preço total da movimentação */
  totalPrice?: number | null;
  /** ID da venda associada (se for saída por venda) */
  saleId?: string | null;
  /** ID do pedido de compra associado (se for entrada) */
  purchaseOrderId?: string | null;
  /** ID do usuário que realizou a movimentação */
  userId?: string | null;
  /** Data/hora da movimentação */
  createdAt?: Date;
  /** Objeto do produto (para relacionamentos) */
  product?: Product;
}

/**
 * Entidade StockMovement - Camada de Domínio
 * @description Representa uma movimentação de estoque com suas regras de negócio.
 *              Cada movimentação registra uma alteração no estoque de um produto,
 *              permitindo rastreabilidade completa.
 * @example
 * ```typescript
 * // Entrada de produtos
 * const entry = new StockMovement({
 *   productId: 'produto-uuid',
 *   type: MovementType.ENTRY,
 *   quantity: 50,
 *   unitPrice: 5.50,
 *   reason: 'Compra do fornecedor ABC'
 * });
 * 
 * // Saída por venda
 * const exit = new StockMovement({
 *   productId: 'produto-uuid',
 *   type: MovementType.EXIT,
 *   quantity: 2,
 *   unitPrice: 8.99,
 *   saleId: 'venda-uuid'
 * });
 * ```
 */
export class StockMovement {
  private _id?: string;
  private _productId: string;
  private _type: MovementType;
  private _quantity: number;
  private _reason?: string | null;
  private _unitPrice?: number | null;
  private _totalPrice?: number | null;
  private _saleId?: string | null;
  private _purchaseOrderId?: string | null;
  private _userId?: string | null;
  private _createdAt?: Date;
  private _product?: Product;

  /**
   * Construtor da entidade StockMovement
   * @param props - Propriedades iniciais da movimentação
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: StockMovementProps) {
    this._id = props.id;
    this._productId = props.productId;
    this._type = props.type;
    this._quantity = props.quantity;
    this._reason = props.reason;
    this._unitPrice = props.unitPrice;
    this._totalPrice = props.totalPrice ?? this.calculateTotalPrice();
    this._saleId = props.saleId;
    this._purchaseOrderId = props.purchaseOrderId;
    this._userId = props.userId;
    this._createdAt = props.createdAt;
    this._product = props.product;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados da movimentação
   * @private
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._productId) {
      throw new Error('Produto é obrigatório para movimentação');
    }

    if (this._quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (!Object.values(MovementType).includes(this._type)) {
      throw new Error('Tipo de movimentação inválido');
    }
  }

  /**
   * Calcula o preço total baseado no preço unitário e quantidade
   * @private
   * @returns Preço total ou null se não houver preço unitário
   */
  private calculateTotalPrice(): number | null {
    if (this._unitPrice === null || this._unitPrice === undefined) {
      return null;
    }
    return this._unitPrice * this._quantity;
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único da movimentação
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * ID do produto movimentado
   */
  get productId(): string {
    return this._productId;
  }

  /**
   * Tipo de movimentação
   */
  get type(): MovementType {
    return this._type;
  }

  /**
   * Quantidade movimentada
   */
  get quantity(): number {
    return this._quantity;
  }

  /**
   * Motivo da movimentação
   */
  get reason(): string | null | undefined {
    return this._reason;
  }

  /**
   * Preço unitário no momento da movimentação
   */
  get unitPrice(): number | null | undefined {
    return this._unitPrice;
  }

  /**
   * Preço total da movimentação
   */
  get totalPrice(): number | null | undefined {
    return this._totalPrice;
  }

  /**
   * ID da venda associada
   */
  get saleId(): string | null | undefined {
    return this._saleId;
  }

  /**
   * ID do pedido de compra associado
   */
  get purchaseOrderId(): string | null | undefined {
    return this._purchaseOrderId;
  }

  /**
   * ID do usuário que realizou a movimentação
   */
  get userId(): string | null | undefined {
    return this._userId;
  }

  /**
   * Data/hora da movimentação
   */
  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  /**
   * Objeto do produto relacionado
   */
  get product(): Product | undefined {
    return this._product;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se a movimentação é de entrada (aumenta estoque)
   * @returns true se for entrada ou devolução
   */
  isEntry(): boolean {
    return this._type === MovementType.ENTRY || this._type === MovementType.RETURN;
  }

  /**
   * Verifica se a movimentação é de saída (diminui estoque)
   * @returns true se for saída ou perda
   */
  isExit(): boolean {
    return this._type === MovementType.EXIT || this._type === MovementType.LOSS;
  }

  /**
   * Verifica se a movimentação é um ajuste
   * @returns true se for ajuste de estoque
   */
  isAdjustment(): boolean {
    return this._type === MovementType.ADJUSTMENT;
  }

  /**
   * Calcula o impacto no estoque (positivo ou negativo)
   * @returns Quantidade a adicionar (positivo) ou remover (negativo) do estoque
   */
  getStockImpact(): number {
    if (this.isEntry()) {
      return this._quantity;
    } else if (this.isExit()) {
      return -this._quantity;
    }
    // ADJUSTMENT e TRANSFER dependem do contexto
    return 0;
  }

  /**
   * Retorna uma descrição legível do tipo de movimentação
   * @returns Descrição em português do tipo
   */
  getTypeDescription(): string {
    const descriptions: Record<MovementType, string> = {
      [MovementType.ENTRY]: 'Entrada',
      [MovementType.EXIT]: 'Saída',
      [MovementType.ADJUSTMENT]: 'Ajuste',
      [MovementType.LOSS]: 'Perda',
      [MovementType.RETURN]: 'Devolução',
      [MovementType.TRANSFER]: 'Transferência',
    };
    return descriptions[this._type] || this._type;
  }

  /**
   * Verifica se a movimentação está relacionada a uma venda
   * @returns true se tiver um saleId associado
   */
  isFromSale(): boolean {
    return !!this._saleId;
  }

  /**
   * Verifica se a movimentação está relacionada a um pedido de compra
   * @returns true se tiver um purchaseOrderId associado
   */
  isFromPurchaseOrder(): boolean {
    return !!this._purchaseOrderId;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados da movimentação
   */
  toJSON() {
    return {
      id: this._id,
      productId: this._productId,
      type: this._type,
      typeDescription: this.getTypeDescription(),
      quantity: this._quantity,
      reason: this._reason,
      unitPrice: this._unitPrice,
      totalPrice: this._totalPrice,
      saleId: this._saleId,
      purchaseOrderId: this._purchaseOrderId,
      userId: this._userId,
      createdAt: this._createdAt,
      stockImpact: this.getStockImpact(),
      product: this._product?.toJSON(),
    };
  }
}
