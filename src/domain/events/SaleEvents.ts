/**
 * DOMAIN EVENTS - Eventos de Venda
 */

import { DomainEvent } from './DomainEvent';

/**
 * Evento: Venda criada
 */
export class SaleCreatedEvent extends DomainEvent {
  constructor(
    saleId: string,
    public readonly clientId: string | null,
    public readonly userId: string,
    public readonly total: number,
    public readonly paymentMethod: string,
    public readonly itemCount: number
  ) {
    super(saleId);
  }

  getEventName(): string {
    return 'sale.created';
  }

  getData(): Record<string, any> {
    return {
      saleId: this.aggregateId,
      clientId: this.clientId,
      userId: this.userId,
      total: this.total,
      paymentMethod: this.paymentMethod,
      itemCount: this.itemCount,
      occurredAt: this.occurredAt,
    };
  }
}

/**
 * Evento: Venda cancelada
 */
export class SaleCancelledEvent extends DomainEvent {
  constructor(
    saleId: string,
    public readonly reason: string,
    public readonly total: number
  ) {
    super(saleId);
  }

  getEventName(): string {
    return 'sale.cancelled';
  }

  getData(): Record<string, any> {
    return {
      saleId: this.aggregateId,
      reason: this.reason,
      total: this.total,
      occurredAt: this.occurredAt,
    };
  }
}
