// ============================================================================
// VALIDADORES DE CLIENTE
// ============================================================================

import { z } from 'zod';

/**
 * Schema para criação de cliente
 */
export const createClientSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),

  cpf: z
    .string()
    .length(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d+$/, 'CPF deve conter apenas números')
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

  creditLimit: z
    .number()
    .nonnegative('Limite de crédito não pode ser negativo')
    .default(0),
});

/**
 * Schema para atualização de cliente
 */
export const updateClientSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim()
    .optional(),

  cpf: z
    .string()
    .length(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d+$/, 'CPF deve conter apenas números')
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

  creditLimit: z
    .number()
    .nonnegative('Limite de crédito não pode ser negativo')
    .optional(),
});

export const clientIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

// Tipos inferidos
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
