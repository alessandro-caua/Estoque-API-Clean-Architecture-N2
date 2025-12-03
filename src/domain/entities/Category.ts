// ============================================================================
// ENTIDADE: CATEGORY (CATEGORIA)
// ============================================================================
// Representa uma categoria de produtos do estoque.
// Exemplo: Bebidas, Laticínios, Carnes, Higiene, Limpeza, etc.
// 
// Requisitos atendidos:
// - RF01: Cadastro de produtos (categorização)
// - RF02: Organização e classificação de produtos
// ============================================================================

/**
 * Interface de propriedades da categoria
 * @description Define a estrutura de dados para criar/atualizar uma categoria
 */
export interface CategoryProps {
  /** Identificador único da categoria (UUID) */
  id?: string;
  /** Nome da categoria */
  name: string;
  /** Descrição detalhada da categoria */
  description?: string | null;
  /** Data de criação do registro */
  createdAt?: Date;
  /** Data da última atualização */
  updatedAt?: Date;
}

/**
 * Entidade Category - Camada de Domínio
 * @description Representa uma categoria de produtos com suas regras de negócio.
 *              Categorias são usadas para organizar e classificar produtos,
 *              facilitando buscas e relatórios.
 * @example
 * ```typescript
 * const category = new Category({
 *   name: 'Bebidas',
 *   description: 'Refrigerantes, sucos, águas e bebidas alcoólicas'
 * });
 * ```
 */
export class Category {
  private _id?: string;
  private _name: string;
  private _description?: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  /**
   * Construtor da entidade Category
   * @param props - Propriedades iniciais da categoria
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados da categoria
   * @private
   * @throws Error se o nome for inválido
   */
  private validate(): void {
    if (!this._name || this._name.trim().length < 2) {
      throw new Error('Nome da categoria deve ter pelo menos 2 caracteres');
    }

    if (this._name.length > 100) {
      throw new Error('Nome da categoria não pode exceder 100 caracteres');
    }
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único da categoria
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Nome da categoria
   */
  get name(): string {
    return this._name;
  }

  /**
   * Descrição da categoria
   */
  get description(): string | null | undefined {
    return this._description;
  }

  /**
   * Data de criação do registro
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

  // ==================== SETTERS ====================

  /**
   * Define o nome da categoria
   * @param value - Novo nome (mínimo 2 caracteres)
   * @throws Error se o nome for inválido
   */
  set name(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Nome da categoria deve ter pelo menos 2 caracteres');
    }
    if (value.length > 100) {
      throw new Error('Nome da categoria não pode exceder 100 caracteres');
    }
    this._name = value;
  }

  /**
   * Define a descrição da categoria
   * @param value - Nova descrição
   */
  set description(value: string | null | undefined) {
    this._description = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se a categoria tem descrição
   * @returns true se a descrição estiver preenchida
   */
  hasDescription(): boolean {
    return !!this._description && this._description.trim().length > 0;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados da categoria
   */
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
