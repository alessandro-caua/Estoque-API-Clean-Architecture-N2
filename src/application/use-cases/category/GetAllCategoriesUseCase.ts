// ============================================================================
// USE CASE: LISTAR TODAS AS CATEGORIAS
// ============================================================================
// 
// Use Case de listagem (Query).
// Retorna todas as categorias cadastradas.
// 
// ============================================================================

import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/ports';

/**
 * Use Case: Listar todas as categorias
 * 
 * @description
 * Retorna a lista completa de categorias cadastradas.
 * Para sistemas com muitos registros, considere adicionar paginação.
 * 
 * @example
 * ```typescript
 * const useCase = new GetAllCategoriesUseCase(categoryRepository);
 * const categories = await useCase.execute();
 * 
 * console.log(`Total: ${categories.length} categorias`);
 * categories.forEach(c => console.log(c.name));
 * ```
 */
export class GetAllCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a listagem
   * 
   * @returns Promise com array de categorias
   */
  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
