// ============================================================================
// USE CASE: ATUALIZAR CATEGORIA
// ============================================================================
// 
// Use Case de modificação (Command).
// Atualiza dados de uma categoria existente.
// 
// ============================================================================

import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/ports';
import { UpdateCategoryDTO } from '../../dtos';
import { 
  EntityNotFoundError, 
  EntityAlreadyExistsError 
} from '../../../domain/errors';

/**
 * Use Case: Atualizar categoria existente
 * 
 * @description
 * Permite atualização parcial dos dados de uma categoria.
 * Valida unicidade do nome se estiver sendo alterado.
 * 
 * CONCEITO: Partial Update (Atualização Parcial)
 * ===============================================
 * 
 * O DTO tem todos os campos opcionais (UpdateCategoryDTO).
 * Isso permite enviar apenas os campos que deseja alterar.
 * 
 * Exemplo:
 * - Atualizar só o nome: { name: "Novo Nome" }
 * - Atualizar só a descrição: { description: "Nova desc" }
 * - Atualizar ambos: { name: "Novo", description: "Nova" }
 * 
 * @example
 * ```typescript
 * const useCase = new UpdateCategoryUseCase(categoryRepository);
 * 
 * // Atualizar apenas o nome
 * const updated = await useCase.execute('uuid', {
 *   name: 'Bebidas Geladas'
 * });
 * ```
 */
export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a atualização
   * 
   * @param id - ID da categoria a atualizar
   * @param data - Dados parciais para atualização
   * @returns Promise com a categoria atualizada
   * @throws EntityNotFoundError se categoria não existir
   * @throws EntityAlreadyExistsError se novo nome já existir
   */
  async execute(id: string, data: UpdateCategoryDTO): Promise<Category> {
    // =========================================================================
    // PASSO 1: Verificar se categoria existe
    // =========================================================================
    const existingCategory = await this.categoryRepository.findById(id);
    
    if (!existingCategory) {
      throw new EntityNotFoundError('Categoria', id);
    }

    // =========================================================================
    // PASSO 2: Se está alterando nome, verificar unicidade
    // =========================================================================
    if (data.name && data.name !== existingCategory.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(data.name);
      
      if (categoryWithSameName) {
        throw new EntityAlreadyExistsError('Categoria', 'nome', data.name);
      }
    }

    // =========================================================================
    // PASSO 3: Atualizar no repositório
    // =========================================================================
    // O repositório cuida de atualizar apenas os campos enviados
    return this.categoryRepository.update(id, data);
  }
}
