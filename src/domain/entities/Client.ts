// ============================================================================
// ENTIDADE: CLIENT (CLIENTE)
// ============================================================================
// Representa um cliente do mercantil com controle de crédito/fiado.
// 
// Requisitos atendidos:
// - RF10: Permitir cadastro de clientes
// - RF11: Manter histórico de compras por cliente
// - RF12: Controlar limite de crédito/fiado dos clientes
// ============================================================================

/**
 * Interface de propriedades do cliente
 * @description Define a estrutura de dados para criar/atualizar um cliente
 */
export interface ClientProps {
  id?: string;
  name: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  creditLimit?: number;
  currentDebt?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Entidade Client - Camada de Domínio
 * @description Representa um cliente do mercantil com suas regras de negócio
 * @example
 * const client = new Client({
 *   name: 'Maria Santos',
 *   cpf: '123.456.789-00',
 *   creditLimit: 500.00
 * });
 */
export class Client {
  private _id?: string;
  private _name: string;
  private _cpf?: string | null;
  private _email?: string | null;
  private _phone?: string | null;
  private _address?: string | null;
  private _creditLimit: number;
  private _currentDebt: number;
  private _isActive: boolean;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: ClientProps) {
    this._id = props.id;
    this._name = props.name;
    this._cpf = props.cpf;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._creditLimit = props.creditLimit ?? 0;
    this._currentDebt = props.currentDebt ?? 0;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do cliente
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._name || this._name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (this._cpf && !this.isValidCPF(this._cpf)) {
      throw new Error('CPF inválido');
    }

    if (this._email && !this.isValidEmail(this._email)) {
      throw new Error('Email inválido');
    }

    if (this._creditLimit < 0) {
      throw new Error('Limite de crédito não pode ser negativo');
    }

    if (this._currentDebt < 0) {
      throw new Error('Dívida atual não pode ser negativa');
    }
  }

  /**
   * Valida formato do CPF (validação simples de formato)
   * @param cpf - CPF a ser validado
   * @returns true se o formato for válido
   */
  private isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  }

  /**
   * Verifica se o email é válido
   * @param email - Email a ser validado
   * @returns true se o email for válido
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ==================== GETTERS ====================

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get cpf(): string | null | undefined {
    return this._cpf;
  }

  get email(): string | null | undefined {
    return this._email;
  }

  get phone(): string | null | undefined {
    return this._phone;
  }

  get address(): string | null | undefined {
    return this._address;
  }

  get creditLimit(): number {
    return this._creditLimit;
  }

  get currentDebt(): number {
    return this._currentDebt;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // ==================== SETTERS ====================

  set name(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    this._name = value;
  }

  set cpf(value: string | null | undefined) {
    if (value && !this.isValidCPF(value)) {
      throw new Error('CPF inválido');
    }
    this._cpf = value;
  }

  set email(value: string | null | undefined) {
    if (value && !this.isValidEmail(value)) {
      throw new Error('Email inválido');
    }
    this._email = value;
  }

  set phone(value: string | null | undefined) {
    this._phone = value;
  }

  set address(value: string | null | undefined) {
    this._address = value;
  }

  set creditLimit(value: number) {
    if (value < 0) {
      throw new Error('Limite de crédito não pode ser negativo');
    }
    this._creditLimit = value;
  }

  set currentDebt(value: number) {
    if (value < 0) {
      throw new Error('Dívida atual não pode ser negativa');
    }
    this._currentDebt = value;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Calcula o crédito disponível do cliente
   * @returns Valor disponível para compras no fiado
   */
  getAvailableCredit(): number {
    return Math.max(0, this._creditLimit - this._currentDebt);
  }

  /**
   * Verifica se o cliente pode comprar no fiado
   * @param amount - Valor da compra
   * @returns true se o cliente tiver crédito disponível suficiente
   */
  canBuyOnCredit(amount: number): boolean {
    return this._isActive && this.getAvailableCredit() >= amount;
  }

  /**
   * Verifica se o cliente tem dívidas pendentes
   * @returns true se o cliente tiver dívidas
   */
  hasDebt(): boolean {
    return this._currentDebt > 0;
  }

  /**
   * Adiciona dívida ao cliente (compra no fiado)
   * @param amount - Valor a ser adicionado à dívida
   * @throws Error se exceder o limite de crédito
   */
  addDebt(amount: number): void {
    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    const newDebt = this._currentDebt + amount;
    if (newDebt > this._creditLimit) {
      throw new Error('Valor excede o limite de crédito disponível');
    }

    this._currentDebt = newDebt;
  }

  /**
   * Reduz a dívida do cliente (pagamento)
   * @param amount - Valor a ser abatido da dívida
   * @throws Error se o valor for maior que a dívida
   */
  payDebt(amount: number): void {
    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (amount > this._currentDebt) {
      throw new Error('Valor de pagamento maior que a dívida atual');
    }

    this._currentDebt -= amount;
  }

  /**
   * Quita toda a dívida do cliente
   * @returns Valor total pago
   */
  payFullDebt(): number {
    const totalPaid = this._currentDebt;
    this._currentDebt = 0;
    return totalPaid;
  }

  /**
   * Calcula a porcentagem de utilização do crédito
   * @returns Porcentagem de 0 a 100
   */
  getCreditUtilizationPercentage(): number {
    if (this._creditLimit === 0) return 0;
    return (this._currentDebt / this._creditLimit) * 100;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto com os dados do cliente
   */
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      cpf: this._cpf,
      email: this._email,
      phone: this._phone,
      address: this._address,
      creditLimit: this._creditLimit,
      currentDebt: this._currentDebt,
      availableCredit: this.getAvailableCredit(),
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
