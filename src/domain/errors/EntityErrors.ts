// ============================================================================
// ERROS DE ENTIDADE
// ============================================================================
// 
// Erros relacionados a problemas com entidades (não encontradas, duplicadas, etc.)
// 
// Estes erros são lançados quando:
// - Uma entidade não é encontrada no banco de dados
// - Tentativa de criar entidade duplicada
// - Entidade está em estado inválido para a operação
// 
// ============================================================================

import { DomainError } from './DomainError';

/**
 * Erro lançado quando uma entidade não é encontrada
 * 
 * @description
 * Este erro deve ser lançado pelos Use Cases quando uma busca
 * por ID ou outro identificador único não retorna resultado.
 * 
 * Na camada de apresentação (Controller), este erro geralmente
 * é convertido em uma resposta HTTP 404 (Not Found).
 * 
 * @example
 * ```typescript
 * const product = await productRepository.findById(id);
 * if (!product) {
 *   throw new EntityNotFoundError('Produto', id);
 * }
 * ```
 */
export class EntityNotFoundError extends DomainError {
  /**
   * Nome da entidade que não foi encontrada
   */
  public readonly entityName: string;

  /**
   * Identificador usado na busca
   */
  public readonly entityId: string;

  constructor(entityName: string, entityId: string) {
    // Cria mensagem amigável em português
    super(
      `${entityName} não encontrado(a) com o identificador: ${entityId}`,
      'ENTITY_NOT_FOUND'
    );
    this.entityName = entityName;
    this.entityId = entityId;
  }
}

/**
 * Erro lançado quando já existe uma entidade com os mesmos dados únicos
 * 
 * @description
 * Este erro deve ser lançado quando há violação de unicidade,
 * como tentar criar um usuário com email já existente.
 * 
 * Na camada de apresentação, geralmente é convertido em HTTP 409 (Conflict).
 * 
 * @example
 * ```typescript
 * const existing = await userRepository.findByEmail(email);
 * if (existing) {
 *   throw new EntityAlreadyExistsError('Usuário', 'email', email);
 * }
 * ```
 */
export class EntityAlreadyExistsError extends DomainError {
  /**
   * Nome da entidade
   */
  public readonly entityName: string;

  /**
   * Nome do campo que violou a unicidade
   */
  public readonly field: string;

  /**
   * Valor que já existe
   */
  public readonly value: string;

  constructor(entityName: string, field: string, value: string) {
    super(
      `Já existe um(a) ${entityName} com ${field}: ${value}`,
      'ENTITY_ALREADY_EXISTS'
    );
    this.entityName = entityName;
    this.field = field;
    this.value = value;
  }
}

/**
 * Erro lançado quando uma entidade está em estado inválido para a operação
 * 
 * @description
 * Este erro é usado quando a entidade existe, mas seu estado atual
 * não permite a operação solicitada.
 * 
 * Exemplos:
 * - Tentar cancelar uma venda já cancelada
 * - Tentar desativar um usuário já desativado
 * - Tentar editar um pedido já finalizado
 * 
 * @example
 * ```typescript
 * if (sale.status === SaleStatus.CANCELLED) {
 *   throw new InvalidEntityStateError(
 *     'Venda',
 *     'cancelar',
 *     'A venda já está cancelada'
 *   );
 * }
 * ```
 */
export class InvalidEntityStateError extends DomainError {
  /**
   * Nome da entidade
   */
  public readonly entityName: string;

  /**
   * Operação que foi tentada
   */
  public readonly operation: string;

  constructor(entityName: string, operation: string, reason: string) {
    super(
      `Não é possível ${operation} ${entityName}: ${reason}`,
      'INVALID_ENTITY_STATE'
    );
    this.entityName = entityName;
    this.operation = operation;
  }
}
