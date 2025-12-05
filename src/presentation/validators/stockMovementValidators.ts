// ============================================================================
// VALIDADORES DE MOVIMENTAÇÃO DE ESTOQUE
// ============================================================================

import { z } from 'zod';
import { MovementType } from '../../domain/entities/StockMovement';

/**
 * Schema para criação de movimentação de estoque
 */
export const createStockMovementSchema = z.object({
  productId: z
    .string({ required_error: 'ID do produto é obrigatório' })
    .uuid('ID do produto deve ser um UUID válido'),

  type: z.nativeEnum(MovementType, {
    required_error: 'Tipo de movimentação é obrigatório',
    errorMap: () => ({ message: 'Tipo de movimentação inválido' }),
  }),

  quantity: z
    .number({ required_error: 'Quantidade é obrigatória' })
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser positiva'),

  reason: z
    .string()
    .max(500, 'Motivo deve ter no máximo 500 caracteres')
    .optional(),

  unitPrice: z
    .number()
    .nonnegative('Preço unitário não pode ser negativo')
    .optional(),
});

export const stockMovementIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

/**
 * Schema para filtros de movimentações
 */
export const stockMovementFiltersSchema = z.object({
  productId: z
    .string()
    .uuid('ID do produto deve ser um UUID válido')
    .optional(),

  type: z
    .nativeEnum(MovementType)
    .optional(),

  startDate: z
    .string()
    .datetime()
    .transform((str: string) => new Date(str))
    .optional(),

  endDate: z
    .string()
    .datetime()
    .transform((str: string) => new Date(str))
    .optional(),
});

// Tipos inferidos
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
export type StockMovementFiltersInput = z.infer<typeof stockMovementFiltersSchema>;
