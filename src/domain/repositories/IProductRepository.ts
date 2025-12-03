// Interface do repositório de Product - Camada de Domínio
import { Product } from '../entities/Product';

export interface ProductFilters {
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  lowStock?: boolean;
  search?: string;
}

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findByBarcode(barcode: string): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  findExpired(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findBySupplier(supplierId: string): Promise<Product[]>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  updateQuantity(id: string, quantity: number): Promise<Product>;
  delete(id: string): Promise<void>;
}
