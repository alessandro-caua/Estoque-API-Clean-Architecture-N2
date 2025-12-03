// ============================================================================
// ENTIDADE: PRODUCT (PRODUTO)
// ============================================================================
// Representa um produto do estoque do supermercado.
// Contém informações de preço, quantidade, categoria e fornecedor.
// 
// Requisitos atendidos:
// - RF01: Cadastro de produtos com nome, descrição, preço, quantidade e categoria
// - RF02: Atualização de dados do produto
// - RF03: Exclusão lógica/física de produtos
// - RF04: Listagem com filtros por categoria/nome
// - RF05: Alerta de estoque mínimo
// ============================================================================

import { Category } from './Category';
import { Supplier } from './Supplier';

/**
 * Interface de propriedades do produto
 * @description Define a estrutura de dados para criar/atualizar um produto
 */
export interface ProductProps {
  /** Identificador único do produto (UUID) */
  id?: string;
  /** Nome do produto */
  name: string;
  /** Descrição detalhada do produto */
  description?: string | null;
  /** Código de barras (EAN-13 ou similar) */
  barcode?: string | null;
  /** Preço de venda ao consumidor */
  salePrice: number;
  /** Preço de custo (compra do fornecedor) */
  costPrice: number;
  /** Quantidade atual em estoque */
  quantity?: number;
  /** Quantidade mínima para alerta de estoque baixo */
  minQuantity?: number;
  /** Unidade de medida (UN, KG, L, etc.) */
  unit?: string;
  /** ID da categoria do produto */
  categoryId: string;
  /** ID do fornecedor (opcional) */
  supplierId?: string | null;
  /** Status do produto (ativo/inativo) */
  isActive?: boolean;
  /** Data de validade do produto */
  expirationDate?: Date | null;
  /** Data de criação do registro */
  createdAt?: Date;
  /** Data da última atualização */
  updatedAt?: Date;
  /** Objeto da categoria (para relacionamentos) */
  category?: Category;
  /** Objeto do fornecedor (para relacionamentos) */
  supplier?: Supplier | null;
}

/**
 * Entidade Product - Camada de Domínio
 * @description Representa um produto com todas suas regras de negócio.
 *              O produto é a entidade central do sistema de estoque.
 * @example
 * ```typescript
 * const product = new Product({
 *   name: 'Refrigerante Cola 2L',
 *   salePrice: 8.99,
 *   costPrice: 5.50,
 *   quantity: 100,
 *   minQuantity: 20,
 *   unit: 'UN',
 *   categoryId: 'categoria-bebidas-uuid'
 * });
 * ```
 */
export class Product {
  private _id?: string;
  private _name: string;
  private _description?: string | null;
  private _barcode?: string | null;
  private _salePrice: number;
  private _costPrice: number;
  private _quantity: number;
  private _minQuantity: number;
  private _unit: string;
  private _categoryId: string;
  private _supplierId?: string | null;
  private _isActive: boolean;
  private _expirationDate?: Date | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _category?: Category;
  private _supplier?: Supplier | null;

  /**
   * Construtor da entidade Product
   * @param props - Propriedades iniciais do produto
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._barcode = props.barcode;
    this._salePrice = props.salePrice;
    this._costPrice = props.costPrice;
    this._quantity = props.quantity ?? 0;
    this._minQuantity = props.minQuantity ?? 10;
    this._unit = props.unit ?? 'UN';
    this._categoryId = props.categoryId;
    this._supplierId = props.supplierId;
    this._isActive = props.isActive ?? true;
    this._expirationDate = props.expirationDate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._category = props.category;
    this._supplier = props.supplier;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do produto
   * @private
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._name || this._name.trim().length < 2) {
      throw new Error('Nome do produto deve ter pelo menos 2 caracteres');
    }

    if (this._salePrice < 0) {
      throw new Error('Preço de venda não pode ser negativo');
    }

    if (this._costPrice < 0) {
      throw new Error('Preço de custo não pode ser negativo');
    }

    if (this._quantity < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    if (this._minQuantity < 0) {
      throw new Error('Quantidade mínima não pode ser negativa');
    }

    if (!this._categoryId) {
      throw new Error('Categoria é obrigatória');
    }
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único do produto
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Nome do produto
   */
  get name(): string {
    return this._name;
  }

  /**
   * Descrição do produto
   */
  get description(): string | null | undefined {
    return this._description;
  }

  /**
   * Código de barras
   */
  get barcode(): string | null | undefined {
    return this._barcode;
  }

  /**
   * Preço de venda ao consumidor
   */
  get salePrice(): number {
    return this._salePrice;
  }

  /**
   * Preço de custo (compra)
   */
  get costPrice(): number {
    return this._costPrice;
  }

  /**
   * Quantidade atual em estoque
   */
  get quantity(): number {
    return this._quantity;
  }

  /**
   * Quantidade mínima para alerta
   */
  get minQuantity(): number {
    return this._minQuantity;
  }

  /**
   * Unidade de medida
   */
  get unit(): string {
    return this._unit;
  }

  /**
   * ID da categoria
   */
  get categoryId(): string {
    return this._categoryId;
  }

  /**
   * ID do fornecedor
   */
  get supplierId(): string | null | undefined {
    return this._supplierId;
  }

  /**
   * Status ativo/inativo
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Data de validade
   */
  get expirationDate(): Date | null | undefined {
    return this._expirationDate;
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
   * Objeto da categoria relacionada
   */
  get category(): Category | undefined {
    return this._category;
  }

  /**
   * Objeto do fornecedor relacionado
   */
  get supplier(): Supplier | null | undefined {
    return this._supplier;
  }

  // ==================== SETTERS ====================

  /**
   * Define o nome do produto
   * @param value - Novo nome (mínimo 2 caracteres)
   * @throws Error se o nome for inválido
   */
  set name(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Nome do produto deve ter pelo menos 2 caracteres');
    }
    this._name = value;
  }

  /**
   * Define a descrição do produto
   * @param value - Nova descrição
   */
  set description(value: string | null | undefined) {
    this._description = value;
  }

  /**
   * Define o código de barras
   * @param value - Novo código de barras
   */
  set barcode(value: string | null | undefined) {
    this._barcode = value;
  }

  /**
   * Define o preço de venda
   * @param value - Novo preço (deve ser >= 0)
   * @throws Error se o preço for negativo
   */
  set salePrice(value: number) {
    if (value < 0) {
      throw new Error('Preço de venda não pode ser negativo');
    }
    this._salePrice = value;
  }

  /**
   * Define o preço de custo
   * @param value - Novo preço de custo (deve ser >= 0)
   * @throws Error se o preço for negativo
   */
  set costPrice(value: number) {
    if (value < 0) {
      throw new Error('Preço de custo não pode ser negativo');
    }
    this._costPrice = value;
  }

  /**
   * Define a quantidade em estoque
   * @param value - Nova quantidade (deve ser >= 0)
   * @throws Error se a quantidade for negativa
   */
  set quantity(value: number) {
    if (value < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }
    this._quantity = value;
  }

  /**
   * Define a quantidade mínima para alerta
   * @param value - Nova quantidade mínima (deve ser >= 0)
   * @throws Error se a quantidade for negativa
   */
  set minQuantity(value: number) {
    if (value < 0) {
      throw new Error('Quantidade mínima não pode ser negativa');
    }
    this._minQuantity = value;
  }

  /**
   * Define a unidade de medida
   * @param value - Nova unidade (UN, KG, L, etc.)
   */
  set unit(value: string) {
    this._unit = value;
  }

  /**
   * Define a categoria do produto
   * @param value - ID da nova categoria
   * @throws Error se a categoria não for informada
   */
  set categoryId(value: string) {
    if (!value) {
      throw new Error('Categoria é obrigatória');
    }
    this._categoryId = value;
  }

  /**
   * Define o fornecedor do produto
   * @param value - ID do novo fornecedor (ou null)
   */
  set supplierId(value: string | null | undefined) {
    this._supplierId = value;
  }

  /**
   * Define o status ativo/inativo
   * @param value - true para ativo, false para inativo
   */
  set isActive(value: boolean) {
    this._isActive = value;
  }

  /**
   * Define a data de validade
   * @param value - Nova data de validade (ou null)
   */
  set expirationDate(value: Date | null | undefined) {
    this._expirationDate = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se o estoque está baixo (RF05)
   * @returns true se a quantidade estiver abaixo ou igual à quantidade mínima
   */
  isLowStock(): boolean {
    return this._quantity <= this._minQuantity;
  }

  /**
   * Verifica se o produto está vencido
   * @returns true se a data de validade já passou
   */
  isExpired(): boolean {
    if (!this._expirationDate) return false;
    return new Date() > this._expirationDate;
  }

  /**
   * Verifica se o produto está próximo do vencimento (7 dias)
   * @param daysThreshold - Número de dias para considerar como próximo (padrão: 7)
   * @returns true se o produto vencerá dentro do período
   */
  isNearExpiration(daysThreshold: number = 7): boolean {
    if (!this._expirationDate) return false;
    const today = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);
    return this._expirationDate <= threshold && this._expirationDate > today;
  }

  /**
   * Calcula a margem de lucro em percentual
   * @returns Percentual de lucro sobre o preço de custo
   */
  getProfitMargin(): number {
    if (this._costPrice === 0) return 100;
    return ((this._salePrice - this._costPrice) / this._costPrice) * 100;
  }

  /**
   * Calcula o lucro em valor absoluto
   * @returns Diferença entre preço de venda e preço de custo
   */
  getProfit(): number {
    return this._salePrice - this._costPrice;
  }

  /**
   * Calcula o valor total do estoque deste produto (a preço de custo)
   * @returns Quantidade * Preço de custo
   */
  getStockValueAtCost(): number {
    return this._quantity * this._costPrice;
  }

  /**
   * Calcula o valor total do estoque deste produto (a preço de venda)
   * @returns Quantidade * Preço de venda
   */
  getStockValueAtSalePrice(): number {
    return this._quantity * this._salePrice;
  }

  /**
   * Verifica se há estoque disponível para uma quantidade específica
   * @param requestedQuantity - Quantidade solicitada
   * @returns true se houver estoque suficiente
   */
  hasAvailableStock(requestedQuantity: number): boolean {
    return this._isActive && this._quantity >= requestedQuantity;
  }

  /**
   * Adiciona quantidade ao estoque (entrada)
   * @param amount - Quantidade a adicionar
   * @throws Error se a quantidade for <= 0
   */
  addStock(amount: number): void {
    if (amount <= 0) {
      throw new Error('Quantidade a adicionar deve ser maior que zero');
    }
    this._quantity += amount;
  }

  /**
   * Remove quantidade do estoque (saída)
   * @param amount - Quantidade a remover
   * @throws Error se a quantidade for <= 0 ou maior que o estoque
   */
  removeStock(amount: number): void {
    if (amount <= 0) {
      throw new Error('Quantidade a remover deve ser maior que zero');
    }
    if (amount > this._quantity) {
      throw new Error('Quantidade insuficiente em estoque');
    }
    this._quantity -= amount;
  }

  /**
   * Desativa o produto (exclusão lógica)
   */
  deactivate(): void {
    this._isActive = false;
  }

  /**
   * Ativa o produto
   */
  activate(): void {
    this._isActive = true;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados do produto
   */
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      barcode: this._barcode,
      salePrice: this._salePrice,
      costPrice: this._costPrice,
      quantity: this._quantity,
      minQuantity: this._minQuantity,
      unit: this._unit,
      categoryId: this._categoryId,
      supplierId: this._supplierId,
      isActive: this._isActive,
      expirationDate: this._expirationDate,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      // Campos calculados
      isLowStock: this.isLowStock(),
      isExpired: this.isExpired(),
      profitMargin: this.getProfitMargin(),
      stockValueAtCost: this.getStockValueAtCost(),
      // Relacionamentos
      category: this._category?.toJSON(),
      supplier: this._supplier?.toJSON(),
    };
  }
}
