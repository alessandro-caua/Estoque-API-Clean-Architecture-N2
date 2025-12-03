// ============================================================================
// ENTIDADE: SALE ITEM (ITEM DE VENDA)
// ============================================================================
// Representa um item individual de uma venda.
// ============================================================================

/**
 * Interface de propriedades do item de venda
 */
export interface SaleItemProps {
  id?: string;
  saleId?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

/**
 * Entidade SaleItem - Camada de Domínio
 * @description Representa um item de uma venda com suas regras de negócio
 * @example
 * const item = new SaleItem({
 *   productId: 'product-uuid',
 *   productName: 'Coca-Cola 2L',
 *   quantity: 2,
 *   unitPrice: 8.99,
 *   total: 17.98
 * });
 */
export class SaleItem {
  private _id?: string;
  private _saleId?: string;
  private _productId: string;
  private _productName?: string;
  private _quantity: number;
  private _unitPrice: number;
  private _discount: number;
  private _total: number;

  constructor(props: SaleItemProps) {
    this._id = props.id;
    this._saleId = props.saleId;
    this._productId = props.productId;
    this._productName = props.productName;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._discount = props.discount ?? 0;
    this._total = props.total;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do item
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._productId) {
      throw new Error('ID do produto é obrigatório');
    }

    if (this._quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (this._unitPrice < 0) {
      throw new Error('Preço unitário não pode ser negativo');
    }

    if (this._discount < 0) {
      throw new Error('Desconto não pode ser negativo');
    }

    if (this._total < 0) {
      throw new Error('Total não pode ser negativo');
    }
  }

  // ==================== GETTERS ====================

  get id(): string | undefined {
    return this._id;
  }

  get saleId(): string | undefined {
    return this._saleId;
  }

  get productId(): string {
    return this._productId;
  }

  get productName(): string | undefined {
    return this._productName;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get discount(): number {
    return this._discount;
  }

  get total(): number {
    return this._total;
  }

  // ==================== SETTERS ====================

  set quantity(value: number) {
    if (value <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
    this._quantity = value;
    this.recalculateTotal();
  }

  set discount(value: number) {
    if (value < 0) {
      throw new Error('Desconto não pode ser negativo');
    }
    this._discount = value;
    this.recalculateTotal();
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Recalcula o total do item
   */
  private recalculateTotal(): void {
    this._total = (this._quantity * this._unitPrice) - this._discount;
  }

  /**
   * Calcula o valor bruto (sem desconto)
   * @returns Valor bruto do item
   */
  getGrossValue(): number {
    return this._quantity * this._unitPrice;
  }

  /**
   * Calcula a porcentagem de desconto
   * @returns Porcentagem de desconto
   */
  getDiscountPercentage(): number {
    const gross = this.getGrossValue();
    if (gross === 0) return 0;
    return (this._discount / gross) * 100;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto com os dados do item
   */
  toJSON() {
    return {
      id: this._id,
      saleId: this._saleId,
      productId: this._productId,
      productName: this._productName,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      discount: this._discount,
      total: this._total,
      grossValue: this.getGrossValue(),
    };
  }
}
