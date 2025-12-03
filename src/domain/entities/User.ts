// ============================================================================
// ENTIDADE: USER (USUÁRIO)
// ============================================================================
// Representa um usuário do sistema com controle de acesso por cargo.
// 
// Requisitos atendidos:
// - RF20: Permitir autenticação de usuários
// - RF21: Controle de acesso por cargo (admin, caixa, gerente)
// ============================================================================

/**
 * Enum para os cargos/papéis dos usuários no sistema
 * @description Define os níveis de acesso do sistema
 */
export enum UserRole {
  /** Administrador - acesso total ao sistema */
  ADMIN = 'ADMIN',
  /** Gerente - acesso a relatórios e gestão */
  GERENTE = 'GERENTE',
  /** Caixa/Vendedor - acesso a vendas e consultas */
  CAIXA = 'CAIXA',
}

/**
 * Interface de propriedades do usuário
 * @description Define a estrutura de dados para criar/atualizar um usuário
 */
export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Entidade User - Camada de Domínio
 * @description Representa um usuário do sistema com suas regras de negócio
 * @example
 * const user = new User({
 *   name: 'João Silva',
 *   email: 'joao@mercantil.com',
 *   password: 'hashedPassword',
 *   role: UserRole.CAIXA
 * });
 */
export class User {
  private _id?: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _role: UserRole;
  private _isActive: boolean;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role ?? UserRole.CAIXA;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do usuário
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this._email || !this.isValidEmail(this._email)) {
      throw new Error('Email inválido');
    }

    if (!this._password || this._password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
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

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
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
    if (!value || value.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }
    this._name = value;
  }

  set email(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Email inválido');
    }
    this._email = value;
  }

  set password(value: string) {
    if (value.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
    this._password = value;
  }

  set role(value: UserRole) {
    this._role = value;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Verifica se o usuário é administrador
   * @returns true se o usuário for admin
   */
  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  /**
   * Verifica se o usuário é gerente
   * @returns true se o usuário for gerente
   */
  isManager(): boolean {
    return this._role === UserRole.GERENTE;
  }

  /**
   * Verifica se o usuário pode acessar relatórios financeiros
   * @returns true se o usuário tiver permissão
   */
  canAccessFinancialReports(): boolean {
    return this._role === UserRole.ADMIN || this._role === UserRole.GERENTE;
  }

  /**
   * Verifica se o usuário pode gerenciar outros usuários
   * @returns true se o usuário tiver permissão
   */
  canManageUsers(): boolean {
    return this._role === UserRole.ADMIN;
  }

  /**
   * Verifica se o usuário pode realizar vendas
   * @returns true se o usuário tiver permissão
   */
  canMakeSales(): boolean {
    return this._isActive;
  }

  /**
   * Desativa o usuário
   */
  deactivate(): void {
    this._isActive = false;
  }

  /**
   * Ativa o usuário
   */
  activate(): void {
    this._isActive = true;
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto com os dados do usuário (sem senha)
   */
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      role: this._role,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Converte a entidade para objeto completo (incluindo senha)
   * @returns Objeto com todos os dados do usuário
   * @warning Usar apenas internamente, nunca expor para API
   */
  toFullJSON() {
    return {
      ...this.toJSON(),
      password: this._password,
    };
  }
}
