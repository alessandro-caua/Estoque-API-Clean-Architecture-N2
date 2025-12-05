// ============================================================================
// USE CASE: BUSCAR CATEGORIA POR ID
// ============================================================================
// 
// Use Case simples de consulta (Query).
// 
// CONCEITO: CQRS (Command Query Responsibility Segregation)
// ==========================================================
// 
// Na Clean Architecture, podemos separar Use Cases em:
// 
// COMMANDS (Comandos) - Modificam dados:
//   - CreateCategoryUseCase
//   - UpdateCategoryUseCase
//   - DeleteCategoryUseCase
// 
// QUERIES (Consultas) - Apenas leem dados:
//   - GetCategoryByIdUseCase (este arquivo)
//   - GetAllCategoriesUseCase
// 
// Benefícios desta separação:
// 1. Queries podem usar cache mais facilmente
// 2. Commands podem ter validações mais rigorosas
// 3. Código fica mais organizado e previsível
// 
// ============================================================================

import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/ports';

/**
 * Use Case: Buscar categoria por ID
 * 
 * @description
 * Retorna uma categoria específica ou null se não encontrada.
 * Este é um Use Case de CONSULTA (Query), não modifica dados.
 * 
 * NOTA: Retornamos null em vez de lançar erro quando não encontra.
 * Isso porque "não encontrado" nem sempre é um erro - às vezes
 * o chamador só quer verificar se existe.
 * 
 * @example
 * ```typescript
 * const useCase = new GetCategoryByIdUseCase(categoryRepository);
 * 
 * const category = await useCase.execute('uuid-da-categoria');
 * 
 * if (category) {
 *   console.log(category.name);
 * } else {
 *   console.log('Categoria não encontrada');
 * }
 * ```
 */
export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a busca por ID
   * 
   * @param id - UUID da categoria a buscar
   * @returns Promise com a categoria ou null
   */
  async execute(id: string): Promise<Category | null> {
    // Delega a busca para o repositório
    // O repositório sabe como buscar no banco de dados
    return this.categoryRepository.findById(id);
  }
}
