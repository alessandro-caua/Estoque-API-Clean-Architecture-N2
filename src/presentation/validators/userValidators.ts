// ============================================================================
// VALIDADORES DE USUÁRIO
// ============================================================================

import { z } from 'zod';
import { UserRole } from '../../domain/entities/User';

/**
 * Schema para criação de usuário
 */
export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),

  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),

  role: z
    .nativeEnum(UserRole)
    .default(UserRole.CAIXA),
});

/**
 * Schema para atualização de usuário
 */
export const updateUserSchema = z.object({
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

  role: z
    .nativeEnum(UserRole)
    .optional(),
});

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(1, 'Senha é obrigatória'),
});

/**
 * Schema para alteração de senha
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Senha atual é obrigatória' })
    .min(1, 'Senha atual é obrigatória'),

  newPassword: z
    .string({ required_error: 'Nova senha é obrigatória' })
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres'),
});

export const userIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

// Tipos inferidos
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
