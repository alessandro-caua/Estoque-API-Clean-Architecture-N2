// Repositório de StockMovement com Prisma - Camada de Infraestrutura
import { PrismaClient } from '@prisma/client';
import { StockMovement, MovementType } from '../../domain/entities/StockMovement';
import { Product } from '../../domain/entities/Product';
import { IStockMovementRepository, StockMovementFilters } from '../../domain/repositories/IStockMovementRepository';

export class PrismaStockMovementRepository implements IStockMovementRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToStockMovement(data: any): StockMovement {
    return new StockMovement({
      id: data.id,
      productId: data.productId,
      type: data.type as MovementType,
      quantity: data.quantity,
      reason: data.reason,
      unitPrice: data.unitPrice,
      totalPrice: data.totalPrice,
      createdAt: data.createdAt,
      product: data.product
        ? new Product({
            id: data.product.id,
            name: data.product.name,
            description: data.product.description,
            barcode: data.product.barcode,
            price: data.product.price,
            costPrice: data.product.costPrice,
            quantity: data.product.quantity,
            minQuantity: data.product.minQuantity,
            unit: data.product.unit,
            categoryId: data.product.categoryId,
            supplierId: data.product.supplierId,
            isActive: data.product.isActive,
            expirationDate: data.product.expirationDate,
            createdAt: data.product.createdAt,
            updatedAt: data.product.updatedAt,
          })
        : undefined,
    });
  }

  async create(movement: StockMovement): Promise<StockMovement> {
    const created = await this.prisma.stockMovement.create({
      data: {
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        reason: movement.reason,
        unitPrice: movement.unitPrice,
        totalPrice: movement.totalPrice,
      },
      include: {
        product: true,
      },
    });

    return this.mapToStockMovement(created);
  }

  async findById(id: string): Promise<StockMovement | null> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!movement) return null;

    return this.mapToStockMovement(movement);
  }

  async findAll(filters?: StockMovementFilters): Promise<StockMovement[]> {
    const where: any = {};

    if (filters) {
      if (filters.productId) {
        where.productId = filters.productId;
      }
      if (filters.type) {
        where.type = filters.type;
      }
      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.createdAt.lte = filters.endDate;
        }
      }
    }

    const movements = await this.prisma.stockMovement.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((movement) => this.mapToStockMovement(movement));
  }

  async findByProductId(productId: string): Promise<StockMovement[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((movement) => this.mapToStockMovement(movement));
  }

  async findByType(type: MovementType): Promise<StockMovement[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { type: type },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((movement) => this.mapToStockMovement(movement));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<StockMovement[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((movement) => this.mapToStockMovement(movement));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.stockMovement.delete({
      where: { id },
    });
  }
}
