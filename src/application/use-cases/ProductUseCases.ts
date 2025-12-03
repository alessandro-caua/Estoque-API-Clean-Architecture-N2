// Use Cases de Product - Camada de Aplicação
import { Product } from '../../domain/entities/Product';
import { IProductRepository, ProductFilters } from '../../domain/repositories/IProductRepository';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { ISupplierRepository } from '../../domain/repositories/ISupplierRepository';

// DTOs
export interface CreateProductDTO {
  name: string;
  description?: string;
  barcode?: string;
  salePrice: number;
  costPrice: number;
  quantity?: number;
  minQuantity?: number;
  unit?: string;
  categoryId: string;
  supplierId?: string;
  isActive?: boolean;
  expirationDate?: Date;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  barcode?: string;
  salePrice?: number;
  costPrice?: number;
  quantity?: number;
  minQuantity?: number;
  unit?: string;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  expirationDate?: Date;
}

// Create Product Use Case
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
      throw new Error('Categoria não encontrada');
    }

    // Verificar se fornecedor existe (se fornecido)
    if (data.supplierId) {
      const supplier = await this.supplierRepository.findById(data.supplierId);
      if (!supplier) {
        throw new Error('Fornecedor não encontrado');
      }
    }

    // Verificar código de barras único
    if (data.barcode) {
      const existingByBarcode = await this.productRepository.findByBarcode(data.barcode);
      if (existingByBarcode) {
        throw new Error('Já existe um produto com este código de barras');
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

// Get Product By Id Use Case
export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}

// Get Product By Barcode Use Case
export class GetProductByBarcodeUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(barcode: string): Promise<Product | null> {
    return this.productRepository.findByBarcode(barcode);
  }
}

// Get All Products Use Case
export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return this.productRepository.findAll(filters);
  }
}

// Get Low Stock Products Use Case
export class GetLowStockProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findLowStock();
  }
}

// Get Expired Products Use Case
export class GetExpiredProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findExpired();
  }
}

// Get Products By Category Use Case
export class GetProductsByCategoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }
}

// Get Products By Supplier Use Case
export class GetProductsBySupplierUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(supplierId: string): Promise<Product[]> {
    return this.productRepository.findBySupplier(supplierId);
  }
}

// Update Product Use Case
export class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
    private supplierRepository: ISupplierRepository
  ) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    // Verificar se categoria existe (se fornecida)
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }
    }

    // Verificar se fornecedor existe (se fornecido)
    if (data.supplierId) {
      const supplier = await this.supplierRepository.findById(data.supplierId);
      if (!supplier) {
        throw new Error('Fornecedor não encontrado');
      }
    }

    // Verificar código de barras único
    if (data.barcode) {
      const productWithSameBarcode = await this.productRepository.findByBarcode(data.barcode);
      if (productWithSameBarcode && productWithSameBarcode.id !== id) {
        throw new Error('Já existe um produto com este código de barras');
      }
    }

    return this.productRepository.update(id, data);
  }
}

// Delete Product Use Case
export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    return this.productRepository.delete(id);
  }
}
