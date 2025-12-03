// ============================================================================
// REPOSITÓRIO PRISMA: PURCHASE ORDER (PEDIDO DE COMPRA)
// ============================================================================
// Implementação do repositório de pedidos de compra usando Prisma ORM.
// Camada de Infraestrutura - Implementa a interface definida no domínio.
// ============================================================================

import { PrismaClient } from '@prisma/client';
import { PurchaseOrder, PurchaseOrderStatus } from '../../domain/entities/PurchaseOrder';
import { PurchaseItem } from '../../domain/entities/PurchaseItem';
import { IPurchaseOrderRepository, PurchaseOrderFilters } from '../../domain/repositories/IPurchaseOrderRepository';

/**
 * Repositório Prisma para a entidade PurchaseOrder
 * @implements {IPurchaseOrderRepository}
 */
export class PrismaPurchaseOrderRepository implements IPurchaseOrderRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo pedido de compra com seus itens
   */
  async create(order: PurchaseOrder): Promise<PurchaseOrder> {
    const created = await this.prisma.purchaseOrder.create({
      data: {
        supplierId: order.supplierId,
        status: order.status,
        totalAmount: order.totalAmount,
        expectedDate: order.expectedDeliveryDate,
        receivedDate: order.receivedDate,
        notes: order.notes,
        items: {
          create: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.getTotalPrice(),
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
   * Busca um pedido pelo ID
   */
  async findById(id: string): Promise<PurchaseOrder | null> {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    return order ? this.mapToEntity(order) : null;
  }

  /**
   * Lista pedidos com filtros
   */
  async findAll(filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> {
    const where = this.buildWhereClause(filters);

    const orders = await this.prisma.purchaseOrder.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(o => this.mapToEntity(o));
  }

  /**
   * Busca pedidos de um fornecedor
   */
  async findBySupplier(supplierId: string): Promise<PurchaseOrder[]> {
    const orders = await this.prisma.purchaseOrder.findMany({
      where: { supplierId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(o => this.mapToEntity(o));
  }

  /**
   * Busca pedidos por status
   */
  async findByStatus(status: PurchaseOrderStatus): Promise<PurchaseOrder[]> {
    const orders = await this.prisma.purchaseOrder.findMany({
      where: { status },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(o => this.mapToEntity(o));
  }

  /**
   * Busca pedidos pendentes
   */
  async findPending(): Promise<PurchaseOrder[]> {
    return this.findByStatus(PurchaseOrderStatus.PENDING);
  }

  /**
   * Busca pedidos por período
   */
  async findByPeriod(startDate: Date, endDate: Date): Promise<PurchaseOrder[]> {
    const orders = await this.prisma.purchaseOrder.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(o => this.mapToEntity(o));
  }

  /**
   * Atualiza um pedido
   */
  async update(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const updated = await this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: data.status,
        expectedDate: data.expectedDeliveryDate,
        receivedDate: data.receivedDate,
        notes: data.notes,
      },
      include: { items: true },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Atualiza o status do pedido
   */
  async updateStatus(id: string, status: PurchaseOrderStatus): Promise<PurchaseOrder> {
    return this.update(id, { status });
  }

  /**
   * Registra o recebimento do pedido
   */
  async receive(id: string, receivedDate: Date): Promise<PurchaseOrder> {
    const updated = await this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'RECEIVED',
        receivedDate,
      },
      include: { items: true },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Cancela um pedido
   */
  async cancel(id: string): Promise<PurchaseOrder> {
    return this.updateStatus(id, PurchaseOrderStatus.CANCELLED);
  }

  /**
   * Exclui um pedido
   */
  async delete(id: string): Promise<void> {
    await this.prisma.purchaseOrder.delete({
      where: { id },
    });
  }

  /**
   * Conta pedidos com filtros
   */
  async count(filters?: PurchaseOrderFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.purchaseOrder.count({ where });
  }

  /**
   * Constrói cláusula WHERE
   */
  private buildWhereClause(filters?: PurchaseOrderFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (!filters) return where;

    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
    }
    if (filters.status) {
      where.status = filters.status;
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
    supplierId: string;
    status: string;
    totalAmount: number;
    expectedDate: Date | null;
    receivedDate: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      purchaseOrderId: string;
      productId: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  }): PurchaseOrder {
    const items = data.items.map(item => new PurchaseItem({
      id: item.id,
      purchaseOrderId: item.purchaseOrderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    return new PurchaseOrder({
      id: data.id,
      supplierId: data.supplierId,
      items,
      status: data.status as PurchaseOrderStatus,
      expectedDeliveryDate: data.expectedDate || undefined,
      receivedDate: data.receivedDate || undefined,
      notes: data.notes || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
