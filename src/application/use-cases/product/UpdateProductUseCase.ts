// ============================================================================
// USE CASE: ATUALIZAR PRODUTO
// ============================================================================

import { Product } from '../../../domain/entities/Product';
import { 
  IProductRepository, 
  ICategoryRepository, 
  ISupplierRepository 
} from '../../../domain/ports';
import { UpdateProductDTO } from '../../dtos';
import { 
  EntityNotFoundError, 
  EntityAlreadyExistsError 
} from '../../../domain/errors';

/**
 * Use Case: Atualizar produto existente
 * 
 * @description
 * Permite atualização parcial dos dados de um produto.
 * Valida regras de negócio para os campos alterados.
 */
export class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
    private supplierRepository: ISupplierRepository
  ) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    // Verificar se produto existe
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new EntityNotFoundError('Produto', id);
    }

    // Validar categoria se for alterada
    if (data.categoryId && data.categoryId !== existingProduct.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new EntityNotFoundError('Categoria', data.categoryId);
      }
    }

    // Validar fornecedor se for alterado
    if (data.supplierId && data.supplierId !== existingProduct.supplierId) {
      const supplier = await this.supplierRepository.findById(data.supplierId);
      if (!supplier) {
        throw new EntityNotFoundError('Fornecedor', data.supplierId);
      }
    }

    // Validar código de barras único
    if (data.barcode && data.barcode !== existingProduct.barcode) {
      const productWithBarcode = await this.productRepository.findByBarcode(data.barcode);
      if (productWithBarcode) {
        throw new EntityAlreadyExistsError('Produto', 'código de barras', data.barcode);
      }
    }

    return this.productRepository.update(id, data);
  }
}
