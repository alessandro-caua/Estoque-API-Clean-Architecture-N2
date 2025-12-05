// ============================================================================
// VALIDADORES DE VENDA
// ============================================================================

import { z } from 'zod';
import { PaymentMethod } from '../../domain/entities/Sale';

/**
 * Schema para item da venda
 */
export const saleItemSchema = z.object({
  productId: z
    .string({ required_error: 'ID do produto é obrigatório' })
    .uuid('ID do produto deve ser um UUID válido'),

  quantity: z
    .number({ required_error: 'Quantidade é obrigatória' })
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser positiva'),

  discount: z
    .number()
    .nonnegative('Desconto não pode ser negativo')
    .default(0),
});

/**
 * Schema para criação de venda
 */
export const createSaleSchema = z.object({
  clientId: z
    .string()
    .uuid('ID do cliente deve ser um UUID válido')
    .optional(),

  userId: z
    .string({ required_error: 'ID do usuário é obrigatório' })
    .uuid('ID do usuário deve ser um UUID válido'),

  items: z
    .array(saleItemSchema, { required_error: 'Itens da venda são obrigatórios' })
    .min(1, 'A venda deve ter pelo menos 1 item'),

  discount: z
    .number()
    .nonnegative('Desconto não pode ser negativo')
    .default(0),

  paymentMethod: z.nativeEnum(PaymentMethod, {
    required_error: 'Forma de pagamento é obrigatória',
    errorMap: () => ({ message: 'Forma de pagamento inválida' }),
  }),

  notes: z
    .string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional(),
});

export const saleIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

/**
 * Schema para filtros de vendas
 */
export const saleFiltersSchema = z.object({
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

  clientId: z
    .string()
    .uuid('ID do cliente deve ser um UUID válido')
    .optional(),

  paymentMethod: z
    .nativeEnum(PaymentMethod)
    .optional(),
});

// Tipos inferidos
export type SaleItemInput = z.infer<typeof saleItemSchema>;
export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type SaleFiltersInput = z.infer<typeof saleFiltersSchema>;
