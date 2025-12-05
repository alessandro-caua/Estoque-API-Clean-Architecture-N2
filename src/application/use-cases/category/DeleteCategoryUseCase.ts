// ============================================================================
// USE CASE: EXCLUIR CATEGORIA
// ============================================================================
// 
// Use Case de exclusão (Command).
// Remove uma categoria do sistema.
// 
// IMPORTANTE: Em sistemas de produção, considere:
// - Soft Delete: Marcar como inativo em vez de excluir
// - Verificar dependências: Não excluir se houver produtos
// 
// ============================================================================

import { ICategoryRepository } from '../../../domain/ports';
import { EntityNotFoundError } from '../../../domain/errors';

/**
 * Use Case: Excluir categoria
 * 
 * @description
 * Remove uma categoria do sistema.
 * 
 * CONCEITO: Void Return (Retorno Vazio)
 * =====================================
 * 
 * Este Use Case retorna Promise<void> (nada).
 * Por que? Porque quando excluímos algo, não há o que retornar.
 * 
 * Se a exclusão falhar, lançamos um erro.
 * Se não lançar erro, significa que funcionou.
 * 
 * Alternativa comum:
 * - Retornar boolean (true = sucesso)
 * - Retornar a entidade excluída
 * 
 * @example
 * ```typescript
 * const useCase = new DeleteCategoryUseCase(categoryRepository);
 * 
 * try {
 *   await useCase.execute('uuid-da-categoria');
 *   console.log('Categoria excluída com sucesso!');
 * } catch (error) {
 *   console.log('Falha ao excluir:', error.message);
 * }
 * ```
 */
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a exclusão
   * 
   * @param id - ID da categoria a excluir
   * @returns Promise<void>
   * @throws EntityNotFoundError se categoria não existir
   */
  async execute(id: string): Promise<void> {
    // =========================================================================
    // PASSO 1: Verificar se categoria existe
    // =========================================================================
    // Não faz sentido tentar excluir algo que não existe
    const existingCategory = await this.categoryRepository.findById(id);
    
    if (!existingCategory) {
      throw new EntityNotFoundError('Categoria', id);
    }

    // =========================================================================
    // PASSO 2: Excluir do repositório
    // =========================================================================
    // 
    // MELHORIA FUTURA: Verificar se há produtos nesta categoria
    // antes de excluir. Exemplo:
    // 
    // const productsInCategory = await productRepository.findByCategory(id);
    // if (productsInCategory.length > 0) {
    //   throw new InvalidEntityStateError(
    //     'Categoria',
    //     'excluir',
    //     `Existem ${productsInCategory.length} produtos nesta categoria`
    //   );
    // }
    
    await this.categoryRepository.delete(id);
  }
}
