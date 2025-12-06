import { PrismaClient, Sale as PrismaSale } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * DAO de Venda
 * 
 * Responsabilidade: Acesso a dados de vendas no banco
 * Gerencia operações de PDV, relatórios e consultas de vendas
 */

export type SaleCreateInput = {
  id?: string;
  clientId?: string | null;
  userId: string;
  subtotal: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: string;
  notes?: string | null;
  createdAt?: Date;
  items: {
    productId: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
  }[];
};

export type SaleUpdateInput = {
  paymentStatus?: string;
  notes?: string | null;
};

export type SaleWhereInput = {
  id?: string;
  clientId?: string;
  userId?: string;
  paymentMethod?: string;
  paymentStatus?: string;
};

export class SaleDAO implements IBaseDAO<PrismaSale, SaleCreateInput, SaleUpdateInput, SaleWhereInput> {
  constructor(private prisma: PrismaClient) {}

  async create(data: SaleCreateInput): Promise<PrismaSale> {
    return this.prisma.sale.create({
      data: {
        id: data.id,
        clientId: data.clientId,
        userId: data.userId,
        subtotal: data.subtotal,
        discount: data.discount ?? 0,
        total: data.total,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus ?? 'PAID',
        notes: data.notes,
        createdAt: data.createdAt,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount ?? 0,
            total: item.total,
          })),
        },
      },
      include: {
        items: true,
        client: true,
        user: true,
      },
    });
  }

  async findById(id: string): Promise<PrismaSale | null> {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
        client: true,
        user: true,
      },
    });
  }

  async findOne(where: SaleWhereInput): Promise<PrismaSale | null> {
    return this.prisma.sale.findFirst({
      where,
      include: {
        items: true,
        client: true,
        user: true,
      },
    });
  }

  async findMany(where?: SaleWhereInput): Promise<PrismaSale[]> {
    return this.prisma.sale.findMany({
      where,
      include: {
        items: true,
        client: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: SaleUpdateInput): Promise<PrismaSale> {
    return this.prisma.sale.update({
      where: { id },
      data,
      include: {
        items: true,
        client: true,
        user: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    // Primeiro deleta os itens
    await this.prisma.saleItem.deleteMany({
      where: { saleId: id },
    });
    
    // Depois deleta a venda
    await this.prisma.sale.delete({
      where: { id },
    });
  }

  async count(where?: SaleWhereInput): Promise<number> {
    return this.prisma.sale.count({
      where,
    });
  }

  async exists(where: SaleWhereInput): Promise<boolean> {
    const count = await this.prisma.sale.count({
      where,
    });
    return count > 0;
  }

  /**
   * Busca vendas de um cliente
   */
  async findByClient(clientId: string): Promise<PrismaSale[]> {
    return this.prisma.sale.findMany({
      where: { clientId },
      include: {
        items: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca vendas de um usuário
   */
  async findByUser(userId: string): Promise<PrismaSale[]> {
    return this.prisma.sale.findMany({
      where: { userId },
      include: {
        items: true,
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca vendas por período
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<PrismaSale[]> {
    return this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
        client: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca vendas do dia atual
   */
  async findTodaySales(): Promise<PrismaSale[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findByDateRange(today, tomorrow);
  }

  /**
   * Busca vendas pendentes de pagamento
   */
  async findPendingSales(): Promise<PrismaSale[]> {
    return this.prisma.sale.findMany({
      where: {
        paymentStatus: 'PENDING',
      },
      include: {
        items: true,
        client: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Calcula total de vendas por período
   */
  async sumTotalByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        paymentStatus: 'PAID',
      },
      _sum: {
        total: true,
      },
    });
    return result._sum.total || 0;
  }

  /**
   * Conta vendas por forma de pagamento
   */
  async countByPaymentMethod(): Promise<{ [key: string]: number }> {
    const sales = await this.prisma.sale.groupBy({
      by: ['paymentMethod'],
      _count: {
        paymentMethod: true,
      },
    });

    const result: { [key: string]: number } = {};
    sales.forEach(sale => {
      result[sale.paymentMethod] = sale._count.paymentMethod;
    });
    return result;
  }

  /**
   * Soma total de vendas por usuário
   */
  async sumTotalByUser(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const result = await this.prisma.sale.aggregate({
      where: {
        userId,
        paymentStatus: 'PAID',
        ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
      _sum: {
        total: true,
      },
    });
    return result._sum.total || 0;
  }
}
