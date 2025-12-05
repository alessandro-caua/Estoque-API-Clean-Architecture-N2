// ============================================================================
// VALIDADORES DE FORNECEDOR
// ============================================================================

import { z } from 'zod';

/**
 * Schema para criação de fornecedor
 */
export const createSupplierSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),

  email: z
    .string()
    .email('Email inválido')
    .optional(),

  phone: z
    .string()
    .min(8, 'Telefone deve ter pelo menos 8 caracteres')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional(),

  address: z
    .string()
    .max(500, 'Endereço deve ter no máximo 500 caracteres')
    .optional(),

  cnpj: z
    .string()
    .length(14, 'CNPJ deve ter 14 dígitos')
    .regex(/^\d+$/, 'CNPJ deve conter apenas números')
    .optional(),
});

/**
 * Schema para atualização de fornecedor
 */
export const updateSupplierSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim()
    .optional(),

  email: z
    .string()
    .email('Email inválido')
    .optional(),

  phone: z
    .string()
    .min(8, 'Telefone deve ter pelo menos 8 caracteres')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional(),

  address: z
    .string()
    .max(500, 'Endereço deve ter no máximo 500 caracteres')
    .optional(),

  cnpj: z
    .string()
    .length(14, 'CNPJ deve ter 14 dígitos')
    .regex(/^\d+$/, 'CNPJ deve conter apenas números')
    .optional(),
});

export const supplierIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

// Tipos inferidos
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
