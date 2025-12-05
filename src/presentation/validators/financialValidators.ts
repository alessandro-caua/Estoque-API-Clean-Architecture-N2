// ============================================================================
// VALIDADORES FINANCEIROS
// ============================================================================

import { z } from 'zod';
import { AccountCategory, AccountStatus, AccountType } from '../../domain/entities/FinancialAccount';

/**
 * Schema para criação de conta financeira
 */
export const createFinancialAccountSchema = z.object({
  category: z.nativeEnum(AccountCategory, {
    required_error: 'Categoria é obrigatória',
    errorMap: () => ({ message: 'Categoria inválida' }),
  }),

  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),

  amount: z
    .number({ required_error: 'Valor é obrigatório' })
    .positive('Valor deve ser positivo'),

  dueDate: z
    .string({ required_error: 'Data de vencimento é obrigatória' })
    .datetime()
    .transform((str: string) => new Date(str)),

  referenceId: z
    .string()
    .uuid('ID de referência deve ser um UUID válido')
    .optional(),

  notes: z
    .string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional(),
});

/**
 * Schema para registro de pagamento
 */
export const registerPaymentSchema = z.object({
  accountId: z
    .string({ required_error: 'ID da conta é obrigatório' })
    .uuid('ID da conta deve ser um UUID válido'),

  paidAt: z
    .string()
    .datetime()
    .transform((str: string) => new Date(str))
    .optional(),
});

export const financialAccountIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

/**
 * Schema para filtros de contas
 */
export const financialAccountFiltersSchema = z.object({
  type: z
    .nativeEnum(AccountType)
    .optional(),

  status: z
    .nativeEnum(AccountStatus)
    .optional(),

  category: z
    .nativeEnum(AccountCategory)
    .optional(),

  dueDateStart: z
    .string()
    .datetime()
    .transform((str: string) => new Date(str))
    .optional(),

  dueDateEnd: z
    .string()
    .datetime()
    .transform((str: string) => new Date(str))
    .optional(),
});

/**
 * Schema para período de relatório
 */
export const financialPeriodSchema = z.object({
  startDate: z
    .string({ required_error: 'Data inicial é obrigatória' })
    .datetime()
    .transform((str: string) => new Date(str)),

  endDate: z
    .string({ required_error: 'Data final é obrigatória' })
    .datetime()
    .transform((str: string) => new Date(str)),
});

// Tipos inferidos
export type CreateFinancialAccountInput = z.infer<typeof createFinancialAccountSchema>;
export type RegisterPaymentInput = z.infer<typeof registerPaymentSchema>;
export type FinancialAccountFiltersInput = z.infer<typeof financialAccountFiltersSchema>;
export type FinancialPeriodInput = z.infer<typeof financialPeriodSchema>;
