import { PrismaClient, StockMovement as PrismaStockMovement } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * DAO de Movimentação de Estoque
 * 
 * Responsabilidade: Acesso a dados de movimentações no banco
 * Registra entradas, saídas, vendas e devoluções
 */

export type StockMovementCreateInput = {
  id?: string;
  type: string;
  productId: string;
  quantity: number;
  reason?: string | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  createdAt?: Date;
};

export type StockMovementUpdateInput = {
  reason?: string | null;
};

export type StockMovementWhereInput = {
  id?: string;
  type?: string;
  productId?: string;
};

export class StockMovementDAO implements IBaseDAO<PrismaStockMovement, StockMovementCreateInput, StockMovementUpdateInput, StockMovementWhereInput> {
  constructor(private prisma: PrismaClient) {}

  async create(data: StockMovementCreateInput): Promise<PrismaStockMovement> {
    return this.prisma.stockMovement.create({
      data: {
        id: data.id,
        type: data.type,
        productId: data.productId,
        quantity: data.quantity,
        reason: data.reason,
        unitPrice: data.unitPrice,
        totalPrice: data.totalPrice,
        createdAt: data.createdAt ?? new Date(),
      },
    });
  }

  async findById(id: string): Promise<PrismaStockMovement | null> {
    return this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async findOne(where: StockMovementWhereInput): Promise<PrismaStockMovement | null> {
    return this.prisma.stockMovement.findFirst({
      where,
      include: {
        product: true,
      },
    });
  }

  async findMany(where?: StockMovementWhereInput): Promise<PrismaStockMovement[]> {
    return this.prisma.stockMovement.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: StockMovementUpdateInput): Promise<PrismaStockMovement> {
    return this.prisma.stockMovement.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.stockMovement.delete({
      where: { id },
    });
  }

  async count(where?: StockMovementWhereInput): Promise<number> {
    return this.prisma.stockMovement.count({
      where,
    });
  }

  async exists(where: StockMovementWhereInput): Promise<boolean> {
    const count = await this.prisma.stockMovement.count({
      where,
    });
    return count > 0;
  }

  /**
   * Busca movimentações por produto
   */
  async findByProduct(productId: string): Promise<PrismaStockMovement[]> {
    return this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca movimentações por tipo
   */
  async findByType(type: string): Promise<PrismaStockMovement[]> {
    return this.prisma.stockMovement.findMany({
      where: { type },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca movimentações por período
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<PrismaStockMovement[]> {
    return this.prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca entradas (ENTRY)
   */
  async findEntries(): Promise<PrismaStockMovement[]> {
    return this.findByType('ENTRY');
  }

  /**
   * Busca saídas (EXIT, SALE)
   */
  async findExits(): Promise<PrismaStockMovement[]> {
    return this.prisma.stockMovement.findMany({
      where: {
          type: {
          in: ['EXIT', 'SALE'],
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Soma total de entradas de um produto
   */
  async sumEntriesByProduct(productId: string): Promise<number> {
    const result = await this.prisma.stockMovement.aggregate({
      where: {
        productId,
        type: 'ENTRY',
      },
      _sum: {
        quantity: true,
      },
    });
    return result._sum.quantity || 0;
  }

  /**
   * Soma total de saídas de um produto
   */
  async sumExitsByProduct(productId: string): Promise<number> {
    const result = await this.prisma.stockMovement.aggregate({
      where: {
        productId,
        type: {
          in: ['EXIT', 'SALE'],
        },
      },
      _sum: {
        quantity: true,
      },
    });
    return result._sum.quantity || 0;
  }
}
