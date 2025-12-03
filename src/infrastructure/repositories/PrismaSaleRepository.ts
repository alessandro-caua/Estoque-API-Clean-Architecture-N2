// ============================================================================
// REPOSITÓRIO PRISMA: SALE (VENDA)
// ============================================================================
// Implementação do repositório de vendas usando Prisma ORM.
// Camada de Infraestrutura - Implementa a interface definida no domínio.
// ============================================================================

import { PrismaClient } from '@prisma/client';
import { Sale, PaymentMethod, PaymentStatus } from '../../domain/entities/Sale';
import { SaleItem } from '../../domain/entities/SaleItem';
import { ISaleRepository, SaleFilters, SalesSummary } from '../../domain/repositories/ISaleRepository';

/**
 * Repositório Prisma para a entidade Sale
 * @implements {ISaleRepository}
 */
export class PrismaSaleRepository implements ISaleRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria uma nova venda com seus itens
   */
  async create(sale: Sale): Promise<Sale> {
    const created = await this.prisma.sale.create({
      data: {
        clientId: sale.clientId,
        userId: sale.userId,
        subtotal: sale.subtotal,
        discount: sale.discount,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        paymentStatus: sale.paymentStatus,
        notes: sale.notes,
        items: {
          create: sale.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapToEntity(created);
  }

  /**
   * Busca uma venda pelo ID
   */
  async findById(id: string): Promise<Sale | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: { items: true },
    });

    return sale ? this.mapToEntity(sale) : null;
  }

  /**
   * Lista vendas com filtros
   */
  async findAll(filters?: SaleFilters): Promise<Sale[]> {
    const where = this.buildWhereClause(filters);

    const sales = await this.prisma.sale.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return sales.map(s => this.mapToEntity(s));
  }

  /**
   * Busca vendas de um cliente específico
   */
  async findByClient(clientId: string): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      where: { clientId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return sales.map(s => this.mapToEntity(s));
  }

  /**
   * Busca vendas pendentes de um cliente
   */
  async findPendingByClient(clientId: string): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      where: {
        clientId,
        paymentStatus: 'PENDING',
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return sales.map(s => this.mapToEntity(s));
  }

  /**
   * Busca vendas por período
   */
  async findByPeriod(startDate: Date, endDate: Date): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return sales.map(s => this.mapToEntity(s));
  }

  /**
   * Busca vendas de hoje
   */
  async findToday(): Promise<Sale[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.findByPeriod(startOfDay, endOfDay);
  }

  /**
   * Atualiza uma venda
   */
  async update(id: string, data: Partial<Sale>): Promise<Sale> {
    const updated = await this.prisma.sale.update({
      where: { id },
      data: {
        paymentStatus: data.paymentStatus,
        notes: data.notes,
      },
      include: { items: true },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Atualiza o status de pagamento
   */
  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Sale> {
    return this.update(id, { paymentStatus: status });
  }

  /**
   * Cancela uma venda
   */
  async cancel(id: string): Promise<Sale> {
    return this.updatePaymentStatus(id, PaymentStatus.CANCELLED);
  }

  /**
   * Exclui uma venda
   */
  async delete(id: string): Promise<void> {
    await this.prisma.sale.delete({
      where: { id },
    });
  }

  /**
   * Conta vendas com filtros
   */
  async count(filters?: SaleFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.sale.count({ where });
  }

  /**
   * Retorna o resumo de vendas de um período
   */
  async getSummary(startDate: Date, endDate: Date): Promise<SalesSummary> {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        paymentStatus: { not: 'CANCELLED' },
      },
    });

    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalDiscount = sales.reduce((sum, sale) => sum + sale.discount, 0);

    // Agrupa por forma de pagamento
    const byPaymentMethod: Record<string, { count: number; amount: number }> = {};
    sales.forEach(sale => {
      if (!byPaymentMethod[sale.paymentMethod]) {
        byPaymentMethod[sale.paymentMethod] = { count: 0, amount: 0 };
      }
      byPaymentMethod[sale.paymentMethod].count++;
      byPaymentMethod[sale.paymentMethod].amount += sale.total;
    });

    return {
      totalSales,
      totalAmount,
      totalDiscount,
      averageTicket: totalSales > 0 ? totalAmount / totalSales : 0,
      byPaymentMethod,
    };
  }

  /**
   * Constrói cláusula WHERE baseada nos filtros
   */
  private buildWhereClause(filters?: SaleFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (!filters) return where;

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.paymentMethod) {
      where.paymentMethod = filters.paymentMethod;
    }
    if (filters.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        (where.createdAt as Record<string, unknown>).gte = filters.startDate;
      }
      if (filters.endDate) {
        (where.createdAt as Record<string, unknown>).lte = filters.endDate;
      }
    }

    return where;
  }

  /**
   * Mapeia registro do Prisma para entidade de domínio
   */
  private mapToEntity(data: {
    id: string;
    clientId: string | null;
    userId: string;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      saleId: string;
      productId: string;
      quantity: number;
      unitPrice: number;
      discount: number;
      total: number;
    }>;
  }): Sale {
    const items = data.items.map(item => new SaleItem({
      id: item.id,
      saleId: item.saleId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      total: item.total,
    }));

    return new Sale({
      id: data.id,
      clientId: data.clientId || undefined,
      userId: data.userId,
      subtotal: data.subtotal,
      total: data.total,
      items,
      discount: data.discount,
      paymentMethod: data.paymentMethod as PaymentMethod,
      paymentStatus: data.paymentStatus as PaymentStatus,
      notes: data.notes || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
