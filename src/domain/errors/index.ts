// ============================================================================
// ÍNDICE DE ERROS DE DOMÍNIO
// ============================================================================
// 
// Este arquivo exporta todos os erros de domínio para facilitar a importação.
// 
// PADRÃO: Barrel Export (Exportação em Barril)
// Em vez de importar de vários arquivos:
//   import { DomainError } from './DomainError';
//   import { EntityNotFoundError } from './EntityErrors';
// 
// Você pode importar de um único lugar:
//   import { DomainError, EntityNotFoundError } from './errors';
// 
// ============================================================================

// Erro base que todos os outros estendem
export { DomainError } from './DomainError';

// Erros relacionados a entidades (CRUD)
export {
  EntityNotFoundError,
  EntityAlreadyExistsError,
  InvalidEntityStateError,
} from './EntityErrors';

// Erros de validação de dados
export {
  RequiredFieldError,
  InvalidFieldError,
  ValidationError,
  type FieldValidationError,
} from './ValidationErrors';

// Erros de regras de negócio específicas
export {
  InsufficientStockError,
  InactiveProductError,
  CreditLimitExceededError,
  ClientHasDebtsError,
  UnauthorizedOperationError,
  InvalidCredentialsError,
  UserDeactivatedError,
} from './BusinessErrors';
