// ============================================================================
// PRODUCT DAO - IMPLEMENTAÇÃO PRISMA
// ============================================================================
// 
// DAO específico para a entidade Product.
// Lida APENAS com operações de banco de dados via Prisma.
// 
// RESPONSABILIDADES:
// - Executar queries no banco (create, read, update, delete)
// - Converter tipos Prisma ↔ TypeScript
// - NÃO contém lógica de negócio
// - NÃO conhece entidades de domínio
// 
// ============================================================================

import { PrismaClient, Product as PrismaProduct } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * Tipo de dados para criação de produto no Prisma
 */
export type ProductCreateInput = {
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
  expirationDate?: Date;
  isActive?: boolean;
};

/**
 * Tipo de dados para atualização de produto
 */
export type ProductUpdateInput = Partial<ProductCreateInput>;

/**
 * Tipo de filtros para busca de produtos
 */
export type ProductWhereInput = {
  id?: string;
  name?: string;
  barcode?: string;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
};

/**
 * DAO de Produto usando Prisma
 * 
 * @description
 * Implementa operações de banco de dados para produtos.
 * Este DAO é usado pelo PrismaProductRepository.
 * 
 * @example
 * ```typescript
 * const dao = new ProductDAO(prisma);
 * const product = await dao.create({
 *   name: 'Arroz',
 *   salePrice: 10.5,
 *   costPrice: 7.0,
 *   categoryId: 'uuid-categoria'
 * });
 * ```
 */
export class ProductDAO implements IBaseDAO<PrismaProduct, ProductCreateInput, ProductUpdateInput, ProductWhereInput> {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo produto no banco
   */
  async create(data: ProductCreateInput): Promise<PrismaProduct> {
    return this.prisma.product.create({
      data: {
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
        expirationDate: data.expirationDate,
        isActive: data.isActive ?? true,
      },
    });
  }

  /**
   * Busca produto por ID
   */
  async findById(id: string): Promise<PrismaProduct | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  /**
   * Busca um produto por filtros
   */
  async findOne(where: ProductWhereInput): Promise<PrismaProduct | null> {
    return this.prisma.product.findFirst({
      where,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  /**
   * Busca múltiplos produtos
   */
  async findMany(where?: ProductWhereInput): Promise<PrismaProduct[]> {
    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Atualiza um produto
   */
  async update(id: string, data: ProductUpdateInput): Promise<PrismaProduct> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  /**
   * Remove um produto
   */
  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Conta produtos
   */
  async count(where?: ProductWhereInput): Promise<number> {
    return this.prisma.product.count({ where });
  }

  /**
   * Verifica se produto existe
   */
  async exists(where: ProductWhereInput): Promise<boolean> {
    const count = await this.prisma.product.count({ where });
    return count > 0;
  }

  /**
   * Busca produtos com estoque baixo
   */
  async findLowStock(): Promise<PrismaProduct[]> {
    return this.prisma.product.findMany({
      where: {
        quantity: {
          lte: this.prisma.product.fields.minQuantity,
        },
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: { quantity: 'asc' },
    });
  }

  /**
   * Busca produtos vencidos ou próximos do vencimento
   */
  async findExpired(daysAhead: number = 7): Promise<PrismaProduct[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return this.prisma.product.findMany({
      where: {
        expirationDate: {
          lte: targetDate,
        },
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: { expirationDate: 'asc' },
    });
  }

  /**
   * Atualiza quantidade em estoque
   */
  async updateQuantity(id: string, quantity: number): Promise<PrismaProduct> {
    return this.prisma.product.update({
      where: { id },
      data: { quantity },
    });
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(categoryId: string): Promise<PrismaProduct[]> {
    return this.findMany({ categoryId });
  }

  /**
   * Busca produtos por fornecedor
   */
  async findBySupplier(supplierId: string): Promise<PrismaProduct[]> {
    return this.findMany({ supplierId });
  }

  /**
   * Busca produto por código de barras
   */
  async findByBarcode(barcode: string): Promise<PrismaProduct | null> {
    return this.findOne({ barcode });
  }
}
