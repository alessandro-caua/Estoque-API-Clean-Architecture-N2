// ============================================================================
// MIDDLEWARE DE TRATAMENTO DE ERROS
// ============================================================================
// 
// Este middleware centraliza o tratamento de todos os erros da aplicação.
// 
// CONCEITO: Error Handling Centralizado
// =====================================
// 
// Em vez de cada controller ter seu próprio try-catch com lógica duplicada:
// 
// ```typescript
// // ❌ RUIM - código duplicado em cada controller
// async create(req, res) {
//   try {
//     // ...
//   } catch (error) {
//     if (error instanceof EntityNotFoundError) {
//       return res.status(404).json({ error: error.message });
//     }
//     // mais ifs...
//   }
// }
// ```
// 
// Podemos ter um middleware central que faz isso automaticamente:
// 
// ```typescript
// // ✅ BOM - controller limpo
// async create(req, res, next) {
//   // Se der erro, o middleware trata automaticamente
//   const result = await useCase.execute(data);
//   return res.status(201).json(result);
// }
// ```
// 
// COMO FUNCIONA:
// 1. Controller lança um erro (ou não trata uma exceção)
// 2. Express chama este middleware
// 3. Middleware identifica o tipo de erro
// 4. Retorna resposta HTTP apropriada
// 
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  DomainError,
  EntityNotFoundError,
  EntityAlreadyExistsError,
  InvalidEntityStateError,
  ValidationError,
  InsufficientStockError,
  InactiveProductError,
  CreditLimitExceededError,
  ClientHasDebtsError,
  UnauthorizedOperationError,
  InvalidCredentialsError,
  UserDeactivatedError,
} from '../../domain/errors';

// ============================================================================
// INTERFACE PARA RESPOSTA DE ERRO PADRONIZADA
// ============================================================================

interface ErrorResponse {
  /** Tipo/código do erro */
  error: string;
  /** Mensagem legível para humanos */
  message: string;
  /** Código único do erro (para internacionalização) */
  code?: string;
  /** Detalhes adicionais (validação, etc.) */
  details?: unknown;
  /** Timestamp do erro */
  timestamp: string;
}

// ============================================================================
// MIDDLEWARE PRINCIPAL
// ============================================================================

/**
 * Middleware de tratamento de erros
 * 
 * @description
 * Converte diferentes tipos de erro em respostas HTTP apropriadas.
 * Deve ser o ÚLTIMO middleware registrado no Express.
 * 
 * @example
 * ```typescript
 * // No app.ts, APÓS todas as rotas:
 * app.use(errorHandler);
 * ```
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response {
  // Log do erro para debugging (em produção, usar logger apropriado)
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${new Date().toISOString()}:`, error);

  // Preparar timestamp para a resposta
  const timestamp = new Date().toISOString();

  // ========================================================================
  // ERROS DE VALIDAÇÃO ZOD
  // ========================================================================
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      error: 'ValidationError',
      message: 'Dados de entrada inválidos',
      code: 'VALIDATION_ERROR',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      timestamp,
    };
    return res.status(400).json(response);
  }

  // ========================================================================
  // ERROS DE DOMÍNIO
  // ========================================================================
  if (error instanceof DomainError) {
    // Entidade não encontrada -> 404 Not Found
    if (error instanceof EntityNotFoundError) {
      const response: ErrorResponse = {
        error: 'NotFound',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(404).json(response);
    }

    // Entidade duplicada -> 409 Conflict
    if (error instanceof EntityAlreadyExistsError) {
      const response: ErrorResponse = {
        error: 'Conflict',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(409).json(response);
    }

    // Estado inválido -> 422 Unprocessable Entity
    if (error instanceof InvalidEntityStateError) {
      const response: ErrorResponse = {
        error: 'InvalidState',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(422).json(response);
    }

    // Erro de validação de domínio -> 400 Bad Request
    if (error instanceof ValidationError) {
      const response: ErrorResponse = {
        error: 'ValidationError',
        message: error.message,
        code: error.code,
        details: (error as any).errors,
        timestamp,
      };
      return res.status(400).json(response);
    }

    // Estoque insuficiente -> 400 Bad Request
    if (error instanceof InsufficientStockError) {
      const response: ErrorResponse = {
        error: 'InsufficientStock',
        message: error.message,
        code: error.code,
        details: {
          product: (error as InsufficientStockError).productName,
          available: (error as InsufficientStockError).availableQuantity,
          requested: (error as InsufficientStockError).requestedQuantity,
        },
        timestamp,
      };
      return res.status(400).json(response);
    }

    // Produto inativo -> 400 Bad Request
    if (error instanceof InactiveProductError) {
      const response: ErrorResponse = {
        error: 'InactiveProduct',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(400).json(response);
    }

    // Limite de crédito excedido -> 400 Bad Request
    if (error instanceof CreditLimitExceededError) {
      const response: ErrorResponse = {
        error: 'CreditLimitExceeded',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(400).json(response);
    }

    // Cliente com débitos -> 400 Bad Request
    if (error instanceof ClientHasDebtsError) {
      const response: ErrorResponse = {
        error: 'ClientHasDebts',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(400).json(response);
    }

    // Operação não autorizada -> 403 Forbidden
    if (error instanceof UnauthorizedOperationError) {
      const response: ErrorResponse = {
        error: 'Forbidden',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(403).json(response);
    }

    // Credenciais inválidas -> 401 Unauthorized
    if (error instanceof InvalidCredentialsError) {
      const response: ErrorResponse = {
        error: 'Unauthorized',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(401).json(response);
    }

    // Usuário desativado -> 403 Forbidden
    if (error instanceof UserDeactivatedError) {
      const response: ErrorResponse = {
        error: 'UserDeactivated',
        message: error.message,
        code: error.code,
        timestamp,
      };
      return res.status(403).json(response);
    }

    // Outros erros de domínio genéricos -> 400 Bad Request
    const response: ErrorResponse = {
      error: 'DomainError',
      message: error.message,
      code: error.code,
      timestamp,
    };
    return res.status(400).json(response);
  }

  // ========================================================================
  // ERROS GENÉRICOS (Error padrão do JavaScript)
  // ========================================================================
  // Para erros antigos que ainda usam throw new Error()
  // Em produção, considere não expor mensagens internas
  const response: ErrorResponse = {
    error: 'InternalError',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ocorreu um erro interno no servidor'
      : error.message,
    timestamp,
  };
  return res.status(500).json(response);
}

// ============================================================================
// MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS
// ============================================================================

/**
 * Middleware para rotas não encontradas
 * 
 * @description
 * Retorna 404 para qualquer rota que não existe.
 * Deve ser registrado ANTES do errorHandler.
 * 
 * @example
 * ```typescript
 * // No app.ts:
 * app.use(notFoundHandler);
 * app.use(errorHandler);
 * ```
 */
export function notFoundHandler(
  req: Request,
  res: Response
): Response {
  const response: ErrorResponse = {
    error: 'NotFound',
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
  };
  return res.status(404).json(response);
}
