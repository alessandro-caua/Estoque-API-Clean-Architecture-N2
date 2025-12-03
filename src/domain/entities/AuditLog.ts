// ============================================================================
// ENTIDADE: AUDIT LOG (LOG DE AUDITORIA)
// ============================================================================
// Representa um registro de auditoria do sistema.
// 
// Requisitos atendidos:
// - RF22: Manter logs de acesso e ações críticas
// ============================================================================

/**
 * Enum para os tipos de ação registradas
 */
export enum AuditAction {
  /** Criação de registro */
  CREATE = 'CREATE',
  /** Atualização de registro */
  UPDATE = 'UPDATE',
  /** Exclusão de registro */
  DELETE = 'DELETE',
  /** Login no sistema */
  LOGIN = 'LOGIN',
  /** Logout do sistema */
  LOGOUT = 'LOGOUT',
  /** Tentativa de login falha */
  LOGIN_FAILED = 'LOGIN_FAILED',
  /** Venda realizada */
  SALE = 'SALE',
  /** Cancelamento de venda */
  SALE_CANCELLED = 'SALE_CANCELLED',
  /** Movimentação de estoque */
  STOCK_MOVEMENT = 'STOCK_MOVEMENT',
  /** Pagamento registrado */
  PAYMENT = 'PAYMENT',
}

/**
 * Interface de propriedades do log de auditoria
 */
export interface AuditLogProps {
  id?: string;
  userId: string;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt?: Date;
}

/**
 * Entidade AuditLog - Camada de Domínio
 * @description Representa um registro de auditoria do sistema
 * @example
 * const log = new AuditLog({
 *   userId: 'user-uuid',
 *   action: AuditAction.CREATE,
 *   entity: 'Product',
 *   entityId: 'product-uuid',
 *   details: JSON.stringify({ name: 'Novo Produto' })
 * });
 */
export class AuditLog {
  private _id?: string;
  private _userId: string;
  private _action: AuditAction;
  private _entity: string;
  private _entityId?: string | null;
  private _details?: string | null;
  private _ipAddress?: string | null;
  private _createdAt?: Date;

  constructor(props: AuditLogProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._action = props.action;
    this._entity = props.entity;
    this._entityId = props.entityId;
    this._details = props.details;
    this._ipAddress = props.ipAddress;
    this._createdAt = props.createdAt;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do log
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (!this._entity) {
      throw new Error('Entidade é obrigatória');
    }
  }

  // ==================== GETTERS ====================

  get id(): string | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get action(): AuditAction {
    return this._action;
  }

  get entity(): string {
    return this._entity;
  }

  get entityId(): string | null | undefined {
    return this._entityId;
  }

  get details(): string | null | undefined {
    return this._details;
  }

  get ipAddress(): string | null | undefined {
    return this._ipAddress;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Retorna os detalhes parseados como objeto
   * @returns Objeto com os detalhes ou null
   */
  getParsedDetails(): Record<string, any> | null {
    if (!this._details) return null;
    try {
      return JSON.parse(this._details);
    } catch {
      return null;
    }
  }

  /**
   * Verifica se é uma ação de login
   * @returns true se for ação de login
   */
  isLoginAction(): boolean {
    return this._action === AuditAction.LOGIN || 
           this._action === AuditAction.LOGOUT || 
           this._action === AuditAction.LOGIN_FAILED;
  }

  /**
   * Verifica se é uma ação crítica
   * @returns true se for ação crítica
   */
  isCriticalAction(): boolean {
    return [
      AuditAction.DELETE,
      AuditAction.SALE_CANCELLED,
      AuditAction.LOGIN_FAILED,
    ].includes(this._action);
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto com os dados do log
   */
  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      action: this._action,
      entity: this._entity,
      entityId: this._entityId,
      details: this._details,
      parsedDetails: this.getParsedDetails(),
      ipAddress: this._ipAddress,
      isCritical: this.isCriticalAction(),
      createdAt: this._createdAt,
    };
  }
}
