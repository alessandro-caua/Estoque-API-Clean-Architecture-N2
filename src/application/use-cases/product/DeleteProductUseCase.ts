// ============================================================================
// USE CASE: EXCLUIR PRODUTO
// ============================================================================

import { IProductRepository } from '../../../domain/ports';
import { EntityNotFoundError } from '../../../domain/errors';

/**
 * Use Case: Excluir produto
 * 
 * @description
 * Remove um produto do sistema.
 * 
 * NOTA: Em produção, considere usar "Soft Delete":
 * Em vez de excluir, apenas marque isActive = false.
 * Isso preserva histórico de vendas e movimentações.
 */
export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);
    
    if (!existingProduct) {
      throw new EntityNotFoundError('Produto', id);
    }

    await this.productRepository.delete(id);
  }
}
