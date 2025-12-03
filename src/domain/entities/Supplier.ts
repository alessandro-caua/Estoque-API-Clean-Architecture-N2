// ============================================================================
// ENTIDADE: SUPPLIER (FORNECEDOR)
// ============================================================================
// Representa um fornecedor de produtos para o supermercado.
// Contém informações de contato e identificação fiscal (CNPJ).
// 
// Requisitos atendidos:
// - RF13: Cadastro e edição de fornecedores
// - RF14: Registro de pedidos de compra
// ============================================================================

/**
 * Interface de propriedades do fornecedor
 * @description Define a estrutura de dados para criar/atualizar um fornecedor
 */
export interface SupplierProps {
  /** Identificador único do fornecedor (UUID) */
  id?: string;
  /** Nome ou razão social do fornecedor */
  name: string;
  /** Email de contato */
  email?: string | null;
  /** Telefone de contato */
  phone?: string | null;
  /** Endereço completo */
  address?: string | null;
  /** CNPJ do fornecedor (14 dígitos) */
  cnpj?: string | null;
  /** Data de criação do registro */
  createdAt?: Date;
  /** Data da última atualização */
  updatedAt?: Date;
}

/**
 * Entidade Supplier - Camada de Domínio
 * @description Representa um fornecedor de produtos com suas regras de negócio.
 *              Fornecedores são essenciais para o controle de compras e
 *              rastreabilidade de produtos.
 * @example
 * ```typescript
 * const supplier = new Supplier({
 *   name: 'Distribuidora ABC Ltda',
 *   email: 'contato@abc.com.br',
 *   phone: '(11) 99999-9999',
 *   cnpj: '12345678000190'
 * });
 * ```
 */
export class Supplier {
  private _id?: string;
  private _name: string;
  private _email?: string | null;
  private _phone?: string | null;
  private _address?: string | null;
  private _cnpj?: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  /**
   * Construtor da entidade Supplier
   * @param props - Propriedades iniciais do fornecedor
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: SupplierProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._cnpj = props.cnpj;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do fornecedor
   * @private
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._name || this._name.trim().length < 2) {
      throw new Error('Nome do fornecedor deve ter pelo menos 2 caracteres');
    }

    if (this._email && !this.isValidEmail(this._email)) {
      throw new Error('Email do fornecedor é inválido');
    }

    if (this._cnpj && !this.isValidCNPJ(this._cnpj)) {
      throw new Error('CNPJ do fornecedor é inválido');
    }
  }

  /**
   * Valida formato de email
   * @private
   * @param email - Email a ser validado
   * @returns true se o email for válido
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida formato de CNPJ (apenas dígitos, 14 caracteres)
   * @private
   * @param cnpj - CNPJ a ser validado
   * @returns true se o CNPJ tiver formato válido
   */
  private isValidCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único do fornecedor
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Nome ou razão social do fornecedor
   */
  get name(): string {
    return this._name;
  }

  /**
   * Email de contato
   */
  get email(): string | null | undefined {
    return this._email;
  }

  /**
   * Telefone de contato
   */
  get phone(): string | null | undefined {
    return this._phone;
  }

  /**
   * Endereço completo
   */
  get address(): string | null | undefined {
    return this._address;
  }

  /**
   * CNPJ do fornecedor
   */
  get cnpj(): string | null | undefined {
    return this._cnpj;
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
   * Define o nome do fornecedor
   * @param value - Novo nome (mínimo 2 caracteres)
   * @throws Error se o nome for inválido
   */
  set name(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Nome do fornecedor deve ter pelo menos 2 caracteres');
    }
    this._name = value;
  }

  /**
   * Define o email do fornecedor
   * @param value - Novo email
   * @throws Error se o email for inválido
   */
  set email(value: string | null | undefined) {
    if (value && !this.isValidEmail(value)) {
      throw new Error('Email do fornecedor é inválido');
    }
    this._email = value;
  }

  /**
   * Define o telefone do fornecedor
   * @param value - Novo telefone
   */
  set phone(value: string | null | undefined) {
    this._phone = value;
  }

  /**
   * Define o endereço do fornecedor
   * @param value - Novo endereço
   */
  set address(value: string | null | undefined) {
    this._address = value;
  }

  /**
   * Define o CNPJ do fornecedor
   * @param value - Novo CNPJ (14 dígitos)
   * @throws Error se o CNPJ for inválido
   */
  set cnpj(value: string | null | undefined) {
    if (value && !this.isValidCNPJ(value)) {
      throw new Error('CNPJ do fornecedor é inválido');
    }
    this._cnpj = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se o fornecedor tem contato completo (email e telefone)
   * @returns true se email e telefone estiverem preenchidos
   */
  hasCompleteContact(): boolean {
    return !!this._email && !!this._phone;
  }

  /**
   * Verifica se o fornecedor tem CNPJ cadastrado
   * @returns true se o CNPJ estiver preenchido
   */
  hasCNPJ(): boolean {
    return !!this._cnpj;
  }

  /**
   * Retorna o CNPJ formatado (XX.XXX.XXX/XXXX-XX)
   * @returns CNPJ formatado ou null se não houver CNPJ
   */
  getFormattedCNPJ(): string | null {
    if (!this._cnpj) return null;
    const clean = this._cnpj.replace(/\D/g, '');
    if (clean.length !== 14) return this._cnpj;
    return clean.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados do fornecedor
   */
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      address: this._address,
      cnpj: this._cnpj,
      cnpjFormatted: this.getFormattedCNPJ(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
