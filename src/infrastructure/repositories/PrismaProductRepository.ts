// Repositório de Product com Prisma - Camada de Infraestrutura
import { PrismaClient, Prisma } from '@prisma/client';
import { Product } from '../../domain/entities/Product';
import { Category } from '../../domain/entities/Category';
import { Supplier } from '../../domain/entities/Supplier';
import { IProductRepository, ProductFilters } from '../../domain/repositories/IProductRepository';

export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToProduct(data: any): Product {
    return new Product({
      id: data.id,
      name: data.name,
      description: data.description,
      barcode: data.barcode,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      quantity: data.quantity,
      minQuantity: data.minQuantity,
      unit: data.unit,
      categoryId: data.categoryId,
      supplierId: data.supplierId,
      isActive: data.isActive,
      expirationDate: data.expirationDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      category: data.category
        ? new Category({
            id: data.category.id,
            name: data.category.name,
            description: data.category.description,
            createdAt: data.category.createdAt,
            updatedAt: data.category.updatedAt,
          })
        : undefined,
      supplier: data.supplier
        ? new Supplier({
            id: data.supplier.id,
            name: data.supplier.name,
            email: data.supplier.email,
            phone: data.supplier.phone,
            address: data.supplier.address,
            cnpj: data.supplier.cnpj,
            createdAt: data.supplier.createdAt,
            updatedAt: data.supplier.updatedAt,
          })
        : null,
    });
  }

  async create(product: Product): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        barcode: product.barcode,
        salePrice: product.salePrice,
        costPrice: product.costPrice,
        quantity: product.quantity,
        minQuantity: product.minQuantity,
        unit: product.unit,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        isActive: product.isActive,
        expirationDate: product.expirationDate,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return this.mapToProduct(created);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
      },
    });

    if (!product) return null;

    return this.mapToProduct(product);
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { barcode },
      include: {
        category: true,
        supplier: true,
      },
    });

    if (!product) return null;

    return this.mapToProduct(product);
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters) {
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }
      if (filters.supplierId) {
        where.supplierId = filters.supplierId;
      }
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      if (filters.lowStock) {
        where.quantity = {
          lte: this.prisma.product.fields.minQuantity as any,
        };
      }
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search } },
          { description: { contains: filters.search } },
          { barcode: { contains: filters.search } },
        ];
      }
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { name: 'asc' },
    });

    return products.map((product) => this.mapToProduct(product));
  }

  async findLowStock(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        quantity: {
          lte: 10, // Buscar produtos com quantidade <= minQuantity
        },
        isActive: true,
      },
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { quantity: 'asc' },
    });

    // Filtrar manualmente para comparar com minQuantity de cada produto
    return products
      .filter((p) => p.quantity <= p.minQuantity)
      .map((product) => this.mapToProduct(product));
  }

  async findExpired(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        expirationDate: {
          lt: new Date(),
        },
        isActive: true,
      },
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { expirationDate: 'asc' },
    });

    return products.map((product) => this.mapToProduct(product));
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { name: 'asc' },
    });

    return products.map((product) => this.mapToProduct(product));
  }

  async findBySupplier(supplierId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { supplierId },
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { name: 'asc' },
    });

    return products.map((product) => this.mapToProduct(product));
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        barcode: data.barcode,
        salePrice: data.salePrice,
        costPrice: data.costPrice,
        quantity: data.quantity,
        minQuantity: data.minQuantity,
        unit: data.unit,
        categoryId: data.categoryId,
        supplierId: data.supplierId,
        isActive: data.isActive,
        expirationDate: data.expirationDate,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return this.mapToProduct(updated);
  }

  async updateQuantity(id: string, quantity: number): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: { quantity },
      include: {
        category: true,
        supplier: true,
      },
    });

    return this.mapToProduct(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
