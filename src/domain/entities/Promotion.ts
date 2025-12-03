// ============================================================================
// ENTIDADE: PROMOTION (PROMOÇÃO)
// ============================================================================
// Representa uma promoção ou desconto aplicável a produtos.
// Permite criar campanhas promocionais com período de validade.
// 
// Requisitos atendidos:
// - RF09: Aplicação de descontos e promoções em vendas
// - Gestão de campanhas promocionais
// ============================================================================

import { Product } from './Product';

/**
 * Tipos de desconto disponíveis
 */
export enum DiscountType {
  /** Desconto em percentual (ex: 10% off) */
  PERCENTAGE = 'PERCENTAGE',
  /** Desconto em valor fixo (ex: R$ 5,00 off) */
  FIXED = 'FIXED',
}

/**
 * Interface de propriedades da promoção
 * @description Define a estrutura de dados para criar/atualizar uma promoção
 */
export interface PromotionProps {
  /** Identificador único da promoção (UUID) */
  id?: string;
  /** Nome da promoção */
  name: string;
  /** Descrição detalhada da promoção */
  description?: string | null;
  /** Tipo de desconto (percentual ou fixo) */
  discountType: DiscountType;
  /** Valor do desconto */
  discountValue: number;
  /** Data de início da promoção */
  startDate: Date;
  /** Data de término da promoção */
  endDate: Date;
  /** Quantidade mínima para aplicar a promoção */
  minQuantity?: number;
  /** Valor mínimo da compra para aplicar a promoção */
  minPurchaseValue?: number | null;
  /** ID do produto (se for promoção específica) */
  productId?: string | null;
  /** ID da categoria (se for promoção por categoria) */
  categoryId?: string | null;
  /** Status da promoção */
  isActive?: boolean;
  /** Data de criação do registro */
  createdAt?: Date;
  /** Data da última atualização */
  updatedAt?: Date;
  /** Objeto do produto (para relacionamentos) */
  product?: Product | null;
}

/**
 * Entidade Promotion - Camada de Domínio
 * @description Representa uma promoção com suas regras de negócio.
 *              Promoções podem ser aplicadas a produtos específicos,
 *              categorias inteiras ou ao total da compra.
 * @example
 * ```typescript
 * // Promoção de 15% em um produto específico
 * const promotion = new Promotion({
 *   name: 'Queima de Estoque - Refrigerantes',
 *   discountType: DiscountType.PERCENTAGE,
 *   discountValue: 15,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   productId: 'produto-uuid'
 * });
 * ```
 */
export class Promotion {
  private _id?: string;
  private _name: string;
  private _description?: string | null;
  private _discountType: DiscountType;
  private _discountValue: number;
  private _startDate: Date;
  private _endDate: Date;
  private _minQuantity: number;
  private _minPurchaseValue?: number | null;
  private _productId?: string | null;
  private _categoryId?: string | null;
  private _isActive: boolean;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _product?: Product | null;

  /**
   * Construtor da entidade Promotion
   * @param props - Propriedades iniciais da promoção
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: PromotionProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._discountType = props.discountType;
    this._discountValue = props.discountValue;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._minQuantity = props.minQuantity ?? 1;
    this._minPurchaseValue = props.minPurchaseValue;
    this._productId = props.productId;
    this._categoryId = props.categoryId;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._product = props.product;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados da promoção
   * @private
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Nome da promoção deve ter pelo menos 3 caracteres');
    }

    if (this._discountValue <= 0) {
      throw new Error('Valor do desconto deve ser maior que zero');
    }

    if (this._discountType === DiscountType.PERCENTAGE && this._discountValue > 100) {
      throw new Error('Desconto percentual não pode ser maior que 100%');
    }

    if (this._endDate <= this._startDate) {
      throw new Error('Data de término deve ser posterior à data de início');
    }

    if (this._minQuantity < 1) {
      throw new Error('Quantidade mínima deve ser pelo menos 1');
    }
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único da promoção
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Nome da promoção
   */
  get name(): string {
    return this._name;
  }

  /**
   * Descrição da promoção
   */
  get description(): string | null | undefined {
    return this._description;
  }

  /**
   * Tipo de desconto
   */
  get discountType(): DiscountType {
    return this._discountType;
  }

  /**
   * Valor do desconto
   */
  get discountValue(): number {
    return this._discountValue;
  }

  /**
   * Data de início
   */
  get startDate(): Date {
    return this._startDate;
  }

  /**
   * Data de término
   */
  get endDate(): Date {
    return this._endDate;
  }

  /**
   * Quantidade mínima para aplicar
   */
  get minQuantity(): number {
    return this._minQuantity;
  }

  /**
   * Valor mínimo da compra
   */
  get minPurchaseValue(): number | null | undefined {
    return this._minPurchaseValue;
  }

  /**
   * ID do produto específico
   */
  get productId(): string | null | undefined {
    return this._productId;
  }

  /**
   * ID da categoria
   */
  get categoryId(): string | null | undefined {
    return this._categoryId;
  }

  /**
   * Status ativo/inativo
   */
  get isActive(): boolean {
    return this._isActive;
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
   * Objeto do produto relacionado
   */
  get product(): Product | null | undefined {
    return this._product;
  }

  // ==================== SETTERS ====================

  /**
   * Define o nome da promoção
   * @param value - Novo nome
   */
  set name(value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error('Nome da promoção deve ter pelo menos 3 caracteres');
    }
    this._name = value;
  }

  /**
   * Define a descrição
   * @param value - Nova descrição
   */
  set description(value: string | null | undefined) {
    this._description = value;
  }

  /**
   * Define o valor do desconto
   * @param value - Novo valor
   */
  set discountValue(value: number) {
    if (value <= 0) {
      throw new Error('Valor do desconto deve ser maior que zero');
    }
    if (this._discountType === DiscountType.PERCENTAGE && value > 100) {
      throw new Error('Desconto percentual não pode ser maior que 100%');
    }
    this._discountValue = value;
  }

  /**
   * Define o status da promoção
   * @param value - true para ativo, false para inativo
   */
  set isActive(value: boolean) {
    this._isActive = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se a promoção está válida na data atual
   * @returns true se a promoção está dentro do período de validade e ativa
   */
  isValid(): boolean {
    if (!this._isActive) return false;
    const now = new Date();
    return now >= this._startDate && now <= this._endDate;
  }

  /**
   * Verifica se a promoção expira em breve (7 dias)
   * @param daysThreshold - Número de dias para considerar (padrão: 7)
   * @returns true se a promoção expira dentro do período
   */
  isExpiringSoon(daysThreshold: number = 7): boolean {
    if (!this.isValid()) return false;
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);
    return this._endDate <= threshold;
  }

  /**
   * Verifica se a promoção já expirou
   * @returns true se a data atual é posterior à data de término
   */
  hasExpired(): boolean {
    return new Date() > this._endDate;
  }

  /**
   * Verifica se a promoção ainda não começou
   * @returns true se a data atual é anterior à data de início
   */
  hasNotStarted(): boolean {
    return new Date() < this._startDate;
  }

  /**
   * Verifica se a promoção é aplicável a um produto específico
   * @returns true se a promoção é para produto específico
   */
  isProductSpecific(): boolean {
    return !!this._productId;
  }

  /**
   * Verifica se a promoção é aplicável a uma categoria
   * @returns true se a promoção é para categoria
   */
  isCategoryWide(): boolean {
    return !!this._categoryId && !this._productId;
  }

  /**
   * Verifica se a promoção é global (todos os produtos)
   * @returns true se não há restrição de produto ou categoria
   */
  isGlobal(): boolean {
    return !this._productId && !this._categoryId;
  }

  /**
   * Verifica se pode aplicar a promoção baseado na quantidade
   * @param quantity - Quantidade do produto
   * @returns true se a quantidade atende ao mínimo
   */
  canApplyForQuantity(quantity: number): boolean {
    return quantity >= this._minQuantity;
  }

  /**
   * Verifica se pode aplicar a promoção baseado no valor
   * @param purchaseValue - Valor total da compra
   * @returns true se o valor atende ao mínimo
   */
  canApplyForValue(purchaseValue: number): boolean {
    if (!this._minPurchaseValue) return true;
    return purchaseValue >= this._minPurchaseValue;
  }

  /**
   * Calcula o valor do desconto para um preço
   * @param originalPrice - Preço original
   * @param quantity - Quantidade de itens
   * @returns Valor do desconto a ser aplicado
   */
  calculateDiscount(originalPrice: number, quantity: number = 1): number {
    if (!this.isValid()) return 0;
    if (!this.canApplyForQuantity(quantity)) return 0;

    const totalPrice = originalPrice * quantity;

    if (this._discountType === DiscountType.PERCENTAGE) {
      return totalPrice * (this._discountValue / 100);
    } else {
      // Desconto fixo aplicado por unidade
      return Math.min(this._discountValue * quantity, totalPrice);
    }
  }

  /**
   * Calcula o preço final após aplicar o desconto
   * @param originalPrice - Preço original
   * @param quantity - Quantidade de itens
   * @returns Preço final com desconto aplicado
   */
  calculateFinalPrice(originalPrice: number, quantity: number = 1): number {
    const totalPrice = originalPrice * quantity;
    const discount = this.calculateDiscount(originalPrice, quantity);
    return totalPrice - discount;
  }

  /**
   * Retorna uma descrição formatada do desconto
   * @returns String descrevendo o desconto (ex: "15% de desconto")
   */
  getDiscountDescription(): string {
    if (this._discountType === DiscountType.PERCENTAGE) {
      return `${this._discountValue}% de desconto`;
    }
    return `R$ ${this._discountValue.toFixed(2)} de desconto`;
  }

  /**
   * Calcula quantos dias restam para a promoção expirar
   * @returns Número de dias restantes (negativo se já expirou)
   */
  getDaysRemaining(): number {
    const now = new Date();
    const diff = this._endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Desativa a promoção
   */
  deactivate(): void {
    this._isActive = false;
  }

  /**
   * Ativa a promoção
   */
  activate(): void {
    this._isActive = true;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados da promoção
   */
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      discountType: this._discountType,
      discountValue: this._discountValue,
      discountDescription: this.getDiscountDescription(),
      startDate: this._startDate,
      endDate: this._endDate,
      minQuantity: this._minQuantity,
      minPurchaseValue: this._minPurchaseValue,
      productId: this._productId,
      categoryId: this._categoryId,
      isActive: this._isActive,
      // Campos calculados
      isValid: this.isValid(),
      hasExpired: this.hasExpired(),
      daysRemaining: this.getDaysRemaining(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      product: this._product?.toJSON(),
    };
  }
}
