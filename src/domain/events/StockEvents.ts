/**
 * DOMAIN EVENTS - Eventos de Estoque
 */

import { DomainEvent } from './DomainEvent';

/**
 * Evento: Movimentação de estoque registrada
 */
export class StockMovementRegisteredEvent extends DomainEvent {
  constructor(
    movementId: string,
    public readonly productId: string,
    public readonly type: string,
    public readonly quantity: number,
    public readonly reason?: string
  ) {
    super(movementId);
  }

  getEventName(): string {
    return 'stock.movement-registered';
  }

  getData(): Record<string, any> {
    return {
      movementId: this.aggregateId,
      productId: this.productId,
      type: this.type,
      quantity: this.quantity,
      reason: this.reason,
      occurredAt: this.occurredAt,
    };
  }
}

/**
 * Evento: Estoque atualizado
 */
export class StockUpdatedEvent extends DomainEvent {
  constructor(
    productId: string,
    public readonly previousQuantity: number,
    public readonly newQuantity: number,
    public readonly operation: 'increase' | 'decrease'
  ) {
    super(productId);
  }

  getEventName(): string {
    return 'stock.updated';
  }

  getData(): Record<string, any> {
    return {
      productId: this.aggregateId,
      previousQuantity: this.previousQuantity,
      newQuantity: this.newQuantity,
      operation: this.operation,
      difference: Math.abs(this.newQuantity - this.previousQuantity),
      occurredAt: this.occurredAt,
    };
  }
}
