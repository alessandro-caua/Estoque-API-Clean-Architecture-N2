/**
 * DOMAIN EVENTS - Eventos de Produto
 */

import { DomainEvent } from './DomainEvent';

/**
 * Evento: Produto criado
 */
export class ProductCreatedEvent extends DomainEvent {
  constructor(
    productId: string,
    public readonly productName: string,
    public readonly categoryId: string,
    public readonly salePrice: number
  ) {
    super(productId);
  }

  getEventName(): string {
    return 'product.created';
  }

  getData(): Record<string, any> {
    return {
      productId: this.aggregateId,
      productName: this.productName,
      categoryId: this.categoryId,
      salePrice: this.salePrice,
      occurredAt: this.occurredAt,
    };
  }
}

/**
 * Evento: Produto atualizado
 */
export class ProductUpdatedEvent extends DomainEvent {
  constructor(
    productId: string,
    public readonly changes: Record<string, any>
  ) {
    super(productId);
  }

  getEventName(): string {
    return 'product.updated';
  }

  getData(): Record<string, any> {
    return {
      productId: this.aggregateId,
      changes: this.changes,
      occurredAt: this.occurredAt,
    };
  }
}

/**
 * Evento: Estoque baixo detectado
 */
export class LowStockDetectedEvent extends DomainEvent {
  constructor(
    productId: string,
    public readonly productName: string,
    public readonly currentQuantity: number,
    public readonly minQuantity: number
  ) {
    super(productId);
  }

  getEventName(): string {
    return 'product.low-stock';
  }

  getData(): Record<string, any> {
    return {
      productId: this.aggregateId,
      productName: this.productName,
      currentQuantity: this.currentQuantity,
      minQuantity: this.minQuantity,
      occurredAt: this.occurredAt,
    };
  }
}

/**
 * Evento: Produto deletado
 */
export class ProductDeletedEvent extends DomainEvent {
  constructor(
    productId: string,
    public readonly productName: string
  ) {
    super(productId);
  }

  getEventName(): string {
    return 'product.deleted';
  }

  getData(): Record<string, any> {
    return {
      productId: this.aggregateId,
      productName: this.productName,
      occurredAt: this.occurredAt,
    };
  }
}
