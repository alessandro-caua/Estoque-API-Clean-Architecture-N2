// ============================================================================
// ERROS DE NEGÓCIO
// ============================================================================
// 
// Erros relacionados a violação de regras de negócio específicas.
// 
// Diferença entre Erro de Validação e Erro de Negócio:
// - Validação: Dados em formato errado (ex: email inválido)
// - Negócio: Operação viola regra do domínio (ex: estoque insuficiente)
// 
// CONCEITO IMPORTANTE:
// Erros de negócio refletem as regras que tornam o sistema único.
// São as mesmas regras que existiriam mesmo sem computador.
// 
// ============================================================================

import { DomainError } from './DomainError';

/**
 * Erro lançado quando há estoque insuficiente para uma operação
 * 
 * @description
 * Este é um dos erros mais importantes em um sistema de estoque.
 * Impede vendas ou saídas que deixariam o estoque negativo.
 * 
 * @example
 * ```typescript
 * if (product.quantity < requestedQuantity) {
 *   throw new InsufficientStockError(
 *     product.name,
 *     product.quantity,
 *     requestedQuantity
 *   );
 * }
 * ```
 */
export class InsufficientStockError extends DomainError {
  /**
   * Nome do produto
   */
  public readonly productName: string;

  /**
   * Quantidade disponível atual
   */
  public readonly availableQuantity: number;

  /**
   * Quantidade solicitada
   */
  public readonly requestedQuantity: number;

  constructor(productName: string, available: number, requested: number) {
    super(
      `Estoque insuficiente para "${productName}". ` +
      `Disponível: ${available}, Solicitado: ${requested}`,
      'INSUFFICIENT_STOCK'
    );
    this.productName = productName;
    this.availableQuantity = available;
    this.requestedQuantity = requested;
  }
}

/**
 * Erro lançado quando um produto está inativo
 * 
 * @description
 * Produtos inativos não podem ser vendidos ou movimentados.
 * Isso permite "desativar" produtos sem excluí-los do histórico.
 * 
 * @example
 * ```typescript
 * if (!product.isActive) {
 *   throw new InactiveProductError(product.name);
 * }
 * ```
 */
export class InactiveProductError extends DomainError {
  /**
   * Nome do produto inativo
   */
  public readonly productName: string;

  constructor(productName: string) {
    super(
      `O produto "${productName}" está inativo e não pode ser utilizado`,
      'INACTIVE_PRODUCT'
    );
    this.productName = productName;
  }
}

/**
 * Erro lançado quando cliente excede seu limite de crédito
 * 
 * @description
 * Em vendas fiado, o cliente tem um limite máximo de débito.
 * Este erro impede vendas que ultrapassem esse limite.
 * 
 * @example
 * ```typescript
 * const newDebt = client.currentDebt + saleTotal;
 * if (newDebt > client.creditLimit) {
 *   throw new CreditLimitExceededError(
 *     client.name,
 *     client.creditLimit,
 *     newDebt
 *   );
 * }
 * ```
 */
export class CreditLimitExceededError extends DomainError {
  /**
   * Nome do cliente
   */
  public readonly clientName: string;

  /**
   * Limite de crédito do cliente
   */
  public readonly creditLimit: number;

  /**
   * Débito que seria atingido
   */
  public readonly attemptedDebt: number;

  constructor(clientName: string, creditLimit: number, attemptedDebt: number) {
    super(
      `Limite de crédito excedido para "${clientName}". ` +
      `Limite: R$ ${creditLimit.toFixed(2)}, ` +
      `Débito após venda: R$ ${attemptedDebt.toFixed(2)}`,
      'CREDIT_LIMIT_EXCEEDED'
    );
    this.clientName = clientName;
    this.creditLimit = creditLimit;
    this.attemptedDebt = attemptedDebt;
  }
}

/**
 * Erro lançado quando cliente tem débitos pendentes
 * 
 * @description
 * Algumas operações são bloqueadas quando há débitos,
 * como excluir o cliente ou permitir novas vendas fiado.
 * 
 * @example
 * ```typescript
 * if (client.currentDebt > 0) {
 *   throw new ClientHasDebtsError(client.name, client.currentDebt);
 * }
 * ```
 */
export class ClientHasDebtsError extends DomainError {
  /**
   * Nome do cliente
   */
  public readonly clientName: string;

  /**
   * Valor atual do débito
   */
  public readonly currentDebt: number;

  constructor(clientName: string, currentDebt: number) {
    super(
      `O cliente "${clientName}" possui débitos pendentes: R$ ${currentDebt.toFixed(2)}`,
      'CLIENT_HAS_DEBTS'
    );
    this.clientName = clientName;
    this.currentDebt = currentDebt;
  }
}

/**
 * Erro lançado quando usuário não está autorizado
 * 
 * @description
 * Este erro é diferente de autenticação (quem é você).
 * Autorização é sobre permissão (o que você pode fazer).
 * 
 * @example
 * ```typescript
 * if (user.role !== UserRole.ADMIN) {
 *   throw new UnauthorizedOperationError('excluir usuários');
 * }
 * ```
 */
export class UnauthorizedOperationError extends DomainError {
  /**
   * Operação que foi negada
   */
  public readonly operation: string;

  constructor(operation: string) {
    super(
      `Você não tem permissão para ${operation}`,
      'UNAUTHORIZED_OPERATION'
    );
    this.operation = operation;
  }
}

/**
 * Erro lançado quando credenciais de login são inválidas
 * 
 * @description
 * Por segurança, não especificamos se foi o email ou a senha
 * que estava errada. Isso evita ataques de enumeração.
 */
export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Email ou senha inválidos', 'INVALID_CREDENTIALS');
  }
}

/**
 * Erro lançado quando usuário está desativado
 * 
 * @description
 * Usuários desativados não podem fazer login.
 */
export class UserDeactivatedError extends DomainError {
  constructor() {
    super(
      'Usuário desativado. Entre em contato com o administrador.',
      'USER_DEACTIVATED'
    );
  }
}
