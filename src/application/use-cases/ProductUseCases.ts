// ============================================================================
// USE CASES: PRODUCT (PRODUTO)
// ============================================================================
// Casos de uso para operações com produtos.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// CONCEITO: Dependências entre Entidades
// ======================================
// Produto depende de Categoria (obrigatório) e Fornecedor (opcional).
// Os Use Cases validam essas dependências antes de criar/atualizar.
// 
// Requisitos atendidos:
// - RF01: Cadastro de produtos
// - RF05: Controle de estoque mínimo
// - RF13: Controle de validade
// ============================================================================

import { Product } from '../../domain/entities/Product';
import { IProductRepository, ProductFilters } from '../../domain/repositories/IProductRepository';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { ISupplierRepository } from '../../domain/repositories/ISupplierRepository';

// Importando DTOs da pasta centralizada
import { CreateProductDTO, UpdateProductDTO } from '../dtos';

// Importando erros de domínio específicos
import { 
  EntityNotFoundError, 
  EntityAlreadyExistsError 
} from '../../domain/errors';

// Re-exportando DTOs para manter compatibilidade
export { CreateProductDTO, UpdateProductDTO } from '../dtos';

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Produto
 * @description Cria um novo produto validando categoria, fornecedor e código de barras
 */
export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
    private supplierRepository: ISupplierRepository
  ) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    // Verificar se categoria existe
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new EntityNotFoundError('Categoria', data.categoryId);
    }

    // Verificar se fornecedor existe (se fornecido)
    if (data.supplierId) {
      const supplier = await this.supplierRepository.findById(data.supplierId);
      if (!supplier) {
        throw new EntityNotFoundError('Fornecedor', data.supplierId);
      }
    }

    // Verificar código de barras único
    if (data.barcode) {
      const existingByBarcode = await this.productRepository.findByBarcode(data.barcode);
      if (existingByBarcode) {
        throw new EntityAlreadyExistsError('Produto', 'código de barras', data.barcode);
      }
    }

    const product = new Product({
      name: data.name,
      description: data.description,
      barcode: data.barcode,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      quantity: data.quantity ?? 0,
      minQuantity: data.minQuantity ?? 10,
      unit: data.unit ?? 'UN',
      categoryId: data.categoryId,
      supplierId: data.supplierId,
      isActive: data.isActive ?? true,
      expirationDate: data.expirationDate,
    });

    return this.productRepository.create(product);
  }
}

/**
 * Caso de Uso: Buscar Produto por ID
 */
export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}

/**
 * Caso de Uso: Buscar Produto por Código de Barras
 */
export class GetProductByBarcodeUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(barcode: string): Promise<Product | null> {
    return this.productRepository.findByBarcode(barcode);
  }
}

/**
 * Caso de Uso: Listar Produtos com Filtros
 */
export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return this.productRepository.findAll(filters);
  }
}

/**
 * Caso de Uso: Produtos com Estoque Baixo (RF05)
 * @description Retorna produtos com quantidade abaixo do mínimo
 */
export class GetLowStockProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findLowStock();
  }
}

/**
 * Caso de Uso: Produtos Vencidos (RF13)
 * @description Retorna produtos com data de validade expirada
 */
export class GetExpiredProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findExpired();
  }
}

/**
 * Caso de Uso: Produtos por Categoria
 */
export class GetProductsByCategoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }
}

/**
 * Caso de Uso: Produtos por Fornecedor
 */
export class GetProductsBySupplierUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(supplierId: string): Promise<Product[]> {
    return this.productRepository.findBySupplier(supplierId);
  }
}

/**
 * Caso de Uso: Atualizar Produto
 */
export class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
    private supplierRepository: ISupplierRepository
  ) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new EntityNotFoundError('Produto', id);
    }

    // Verificar se categoria existe (se fornecida)
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new EntityNotFoundError('Categoria', data.categoryId);
      }
    }

    // Verificar se fornecedor existe (se fornecido)
    if (data.supplierId) {
      const supplier = await this.supplierRepository.findById(data.supplierId);
      if (!supplier) {
        throw new EntityNotFoundError('Fornecedor', data.supplierId);
      }
    }

    // Verificar código de barras único
    if (data.barcode) {
      const productWithSameBarcode = await this.productRepository.findByBarcode(data.barcode);
      if (productWithSameBarcode && productWithSameBarcode.id !== id) {
        throw new EntityAlreadyExistsError('Produto', 'código de barras', data.barcode);
      }
    }

    return this.productRepository.update(id, data);
  }
}

/**
 * Caso de Uso: Excluir Produto
 */
export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new EntityNotFoundError('Produto', id);
    }

    return this.productRepository.delete(id);
  }
}
