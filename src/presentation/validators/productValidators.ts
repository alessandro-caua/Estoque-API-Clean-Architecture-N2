// ============================================================================
// VALIDADORES DE PRODUTO
// ============================================================================
// 
// Schemas Zod para validação de entrada das rotas de produto.
// 
// ============================================================================

import { z } from 'zod';

/**
 * Schema para criação de produto
 */
export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),

  description: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),

  barcode: z
    .string()
    .min(8, 'Código de barras deve ter pelo menos 8 caracteres')
    .max(20, 'Código de barras deve ter no máximo 20 caracteres')
    .optional(),

  salePrice: z
    .number({ required_error: 'Preço de venda é obrigatório' })
    .positive('Preço de venda deve ser positivo'),

  costPrice: z
    .number({ required_error: 'Preço de custo é obrigatório' })
    .nonnegative('Preço de custo não pode ser negativo'),

  quantity: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .nonnegative('Quantidade não pode ser negativa')
    .default(0),

  minQuantity: z
    .number()
    .int('Quantidade mínima deve ser um número inteiro')
    .nonnegative('Quantidade mínima não pode ser negativa')
    .default(10),

  unit: z
    .string()
    .max(10, 'Unidade deve ter no máximo 10 caracteres')
    .default('UN'),

  categoryId: z
    .string({ required_error: 'Categoria é obrigatória' })
    .uuid('ID da categoria deve ser um UUID válido'),

  supplierId: z
    .string()
    .uuid('ID do fornecedor deve ser um UUID válido')
    .optional(),

  isActive: z
    .boolean()
    .default(true),

  expirationDate: z
    .string()
    .datetime()
    .transform((str: string) => new Date(str))
    .optional(),
});

/**
 * Schema para atualização de produto
 */
export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim()
    .optional(),

  description: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),

  barcode: z
    .string()
    .min(8, 'Código de barras deve ter pelo menos 8 caracteres')
    .max(20, 'Código de barras deve ter no máximo 20 caracteres')
    .optional(),

  salePrice: z
    .number()
    .positive('Preço de venda deve ser positivo')
    .optional(),

  costPrice: z
    .number()
    .nonnegative('Preço de custo não pode ser negativo')
    .optional(),

  quantity: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .nonnegative('Quantidade não pode ser negativa')
    .optional(),

  minQuantity: z
    .number()
    .int('Quantidade mínima deve ser um número inteiro')
    .nonnegative('Quantidade mínima não pode ser negativa')
    .optional(),

  unit: z
    .string()
    .max(10, 'Unidade deve ter no máximo 10 caracteres')
    .optional(),

  categoryId: z
    .string()
    .uuid('ID da categoria deve ser um UUID válido')
    .optional(),

  supplierId: z
    .string()
    .uuid('ID do fornecedor deve ser um UUID válido')
    .nullable()
    .optional(),

  isActive: z
    .boolean()
    .optional(),

  expirationDate: z
    .string()
    .datetime()
    .transform((str: string) => new Date(str))
    .nullable()
    .optional(),
});

/**
 * Schema para parâmetro ID
 */
export const productIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

/**
 * Schema para busca por código de barras
 */
export const barcodeSchema = z.object({
  barcode: z.string().min(1, 'Código de barras é obrigatório'),
});

// Tipos inferidos
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
