// ============================================================================
// ERROS DE VALIDAÇÃO
// ============================================================================
// 
// Erros relacionados a validação de dados de entrada.
// 
// Estes erros são lançados quando:
// - Dados obrigatórios estão faltando
// - Dados estão em formato inválido
// - Dados violam regras de validação (ex: preço negativo)
// 
// IMPORTANTE: Validação pode ocorrer em duas camadas:
// 1. Entidade (domínio): Regras de negócio fundamentais
// 2. Use Case (aplicação): Validação de contexto/fluxo
// 
// ============================================================================

import { DomainError } from './DomainError';

/**
 * Erro lançado quando dados obrigatórios não foram fornecidos
 * 
 * @description
 * Use quando um campo obrigatório está ausente ou vazio.
 * 
 * @example
 * ```typescript
 * if (!data.name || data.name.trim().length === 0) {
 *   throw new RequiredFieldError('nome');
 * }
 * ```
 */
export class RequiredFieldError extends DomainError {
  /**
   * Nome do campo que está faltando
   */
  public readonly field: string;

  constructor(field: string) {
    super(`O campo "${field}" é obrigatório`, 'REQUIRED_FIELD');
    this.field = field;
  }
}

/**
 * Erro lançado quando um campo tem valor inválido
 * 
 * @description
 * Use quando o valor existe mas não atende aos critérios de validação.
 * 
 * @example
 * ```typescript
 * if (price < 0) {
 *   throw new InvalidFieldError('preço', 'não pode ser negativo');
 * }
 * ```
 */
export class InvalidFieldError extends DomainError {
  /**
   * Nome do campo inválido
   */
  public readonly field: string;

  /**
   * Motivo da invalidez
   */
  public readonly reason: string;

  constructor(field: string, reason: string) {
    super(`O campo "${field}" é inválido: ${reason}`, 'INVALID_FIELD');
    this.field = field;
    this.reason = reason;
  }
}

/**
 * Erro lançado quando múltiplos campos são inválidos
 * 
 * @description
 * Útil quando você quer validar todos os campos de uma vez
 * e retornar todos os erros, ao invés de parar no primeiro.
 * 
 * @example
 * ```typescript
 * const errors: FieldValidationError[] = [];
 * 
 * if (!data.name) errors.push({ field: 'name', message: 'Obrigatório' });
 * if (data.price < 0) errors.push({ field: 'price', message: 'Inválido' });
 * 
 * if (errors.length > 0) {
 *   throw new ValidationError(errors);
 * }
 * ```
 */
export interface FieldValidationError {
  field: string;
  message: string;
}

export class ValidationError extends DomainError {
  /**
   * Lista de erros de validação por campo
   */
  public readonly errors: FieldValidationError[];

  constructor(errors: FieldValidationError[]) {
    // Cria mensagem resumida
    const message = errors.map(e => `${e.field}: ${e.message}`).join('; ');
    super(`Erros de validação: ${message}`, 'VALIDATION_ERROR');
    this.errors = errors;
  }

  /**
   * Sobrescreve toJSON para incluir lista de erros
   */
  public toJSON(): object {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}
