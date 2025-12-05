// ============================================================================
// VALIDADORES DE CATEGORIA
// ============================================================================
// 
// Schemas Zod para validação de entrada das rotas de categoria.
// 
// ============================================================================

import { z } from 'zod';

/**
 * Schema para criação de categoria
 * 
 * @description
 * Valida os dados antes de chegar no Use Case.
 * Se a validação falhar, retorna 400 com detalhes do erro.
 * 
 * @example
 * ```typescript
 * // No controller:
 * const result = createCategorySchema.safeParse(req.body);
 * if (!result.success) {
 *   return res.status(400).json({ 
 *     error: 'Dados inválidos',
 *     details: result.error.errors 
 *   });
 * }
 * const { name, description } = result.data;
 * ```
 */
export const createCategorySchema = z.object({
  /**
   * Nome da categoria
   * - Obrigatório
   * - Entre 2 e 100 caracteres
   * - Removemos espaços extras automaticamente
   */
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  /**
   * Descrição da categoria
   * - Opcional
   * - Máximo 500 caracteres
   */
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
});

/**
 * Schema para atualização de categoria
 * 
 * @description
 * Todos os campos são opcionais (partial update).
 * Permite atualizar apenas os campos enviados.
 */
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
});

/**
 * Schema para parâmetro ID
 * 
 * @description
 * Valida se o ID é um UUID válido.
 */
export const categoryIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

// ============================================================================
// TIPOS INFERIDOS
// ============================================================================
// 
// Zod gera automaticamente os tipos TypeScript a partir dos schemas!
// Isso garante que os tipos estejam sempre sincronizados.
// 
// ============================================================================

/** Tipo inferido para criação de categoria */
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/** Tipo inferido para atualização de categoria */
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
