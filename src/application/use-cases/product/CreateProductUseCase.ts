// ============================================================================
// USE CASE: CRIAR PRODUTO
// ============================================================================
// 
// Este é um dos Use Cases mais importantes do sistema de estoque.
// Criar produto envolve validar várias regras de negócio.
// 
// ============================================================================

import { Product } from '../../../domain/entities/Product';
import { 
  IProductRepository, 
  ICategoryRepository, 
  ISupplierRepository 
} from '../../../domain/ports';
import { CreateProductDTO } from '../../dtos';
import { 
  EntityNotFoundError, 
  EntityAlreadyExistsError 
} from '../../../domain/errors';

/**
 * Use Case: Criar um novo produto
 * 
 * @description
 * Cria um produto no sistema de estoque.
 * Valida se categoria e fornecedor existem.
 * 
 * MÚLTIPLAS DEPENDÊNCIAS:
 * =======================
 * 
 * Este Use Case depende de 3 repositórios:
 * 1. productRepository - Para salvar o produto
 * 2. categoryRepository - Para validar categoria
 * 3. supplierRepository - Para validar fornecedor
 * 
 * Isso é comum em Use Cases mais complexos.
 * Cada dependência é uma interface (abstração).
 * 
 * REGRAS DE NEGÓCIO APLICADAS:
 * ============================
 * 1. Categoria deve existir
 * 2. Fornecedor deve existir (se informado)
 * 3. Código de barras deve ser único
 * 4. Preços não podem ser negativos (validado na entidade)
 * 
 * @example
 * ```typescript
 * const useCase = new CreateProductUseCase(
 *   productRepository,
 *   categoryRepository,
 *   supplierRepository
 * );
 * 
 * const product = await useCase.execute({
 *   name: 'Coca-Cola 2L',
 *   salePrice: 8.99,
 *   costPrice: 5.50,
 *   quantity: 100,
 *   categoryId: 'uuid-bebidas'
 * });
 * ```
 */
export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
    private supplierRepository: ISupplierRepository
  ) {}

  /**
   * Executa a criação do produto
   * 
   * @param data - DTO com dados do produto
   * @returns Promise com o produto criado
   */
  async execute(data: CreateProductDTO): Promise<Product> {
    // =========================================================================
    // PASSO 1: Validar se a categoria existe
    // =========================================================================
    // Todo produto DEVE ter uma categoria
    const category = await this.categoryRepository.findById(data.categoryId);
    
    if (!category) {
      throw new EntityNotFoundError('Categoria', data.categoryId);
    }

    // =========================================================================
    // PASSO 2: Validar se o fornecedor existe (se informado)
    // =========================================================================
    // Fornecedor é opcional, mas se foi informado, deve existir
    if (data.supplierId) {
      const supplier = await this.supplierRepository.findById(data.supplierId);
      
      if (!supplier) {
        throw new EntityNotFoundError('Fornecedor', data.supplierId);
      }
    }

    // =========================================================================
    // PASSO 3: Verificar código de barras único
    // =========================================================================
    // Código de barras (se informado) deve ser único no sistema
    if (data.barcode) {
      const existingByBarcode = await this.productRepository.findByBarcode(data.barcode);
      
      if (existingByBarcode) {
        throw new EntityAlreadyExistsError('Produto', 'código de barras', data.barcode);
      }
    }

    // =========================================================================
    // PASSO 4: Criar a entidade Product
    // =========================================================================
    // A entidade valida os dados no construtor (preços, quantidades, etc)
    const product = new Product({
      name: data.name,
      description: data.description,
      barcode: data.barcode,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      quantity: data.quantity ?? 0,        // Padrão: 0 unidades
      minQuantity: data.minQuantity ?? 10, // Padrão: alerta com 10 unidades
      unit: data.unit ?? 'UN',             // Padrão: unidade
      categoryId: data.categoryId,
      supplierId: data.supplierId,
      isActive: data.isActive ?? true,     // Padrão: ativo
      expirationDate: data.expirationDate,
    });

    // =========================================================================
    // PASSO 5: Persistir no repositório
    // =========================================================================
    return this.productRepository.create(product);
  }
}
